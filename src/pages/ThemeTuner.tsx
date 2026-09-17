/**
 * 라이브 토큰 조정기 (Theme Tuner)
 *
 * tokens.css 의 CSS 변수를 브라우저에서 즉시 바꿔보고, 마음에 들면 브리지 서버로
 * 확정 저장한다. AI 가 미리보기 HTML 을 다시 쓰는 왕복을 없애는 것이 목적이다.
 *
 * 커버 범위: 톤앤매너(T) · 디자인시스템(S) · 가독성(R) 축.
 * 레이아웃(L) 축은 마크업 구조라 여기서 바꿀 수 없다.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import './ThemeTuner.css';

const BRIDGE_URL = 'http://127.0.0.1:4747';
const STORAGE_KEY = 'd2a-theme-tuner-draft';

type Field =
  | { kind: 'color'; name: string; label: string }
  | { kind: 'range'; name: string; label: string; min: number; max: number; step: number; unit: string };

type Group = { title: string; axis: string; fields: Field[] };

const GROUPS: Group[] = [
  {
    title: '톤앤매너',
    axis: 'T',
    fields: [
      { kind: 'color', name: '--color-bg', label: '페이지 배경' },
      { kind: 'color', name: '--color-surface', label: '카드 표면' },
      { kind: 'color', name: '--color-text-strong', label: '본문 텍스트' },
      { kind: 'color', name: '--color-primary', label: 'Primary 액센트' },
      { kind: 'color', name: '--color-sage', label: '보상 · 성공' },
      { kind: 'color', name: '--color-live', label: '라이브 배지' },
      { kind: 'color', name: '--color-warn', label: '이벤트 · 알림' },
    ],
  },
  {
    title: '디자인시스템',
    axis: 'S',
    fields: [
      { kind: 'range', name: '--radius-sm', label: '작은 radius', min: 0, max: 16, step: 1, unit: 'px' },
      { kind: 'range', name: '--radius-md', label: '기본 radius', min: 0, max: 24, step: 1, unit: 'px' },
      { kind: 'range', name: '--radius-lg', label: '카드 radius', min: 0, max: 32, step: 1, unit: 'px' },
      { kind: 'range', name: '--radius-xl', label: '벤토 radius', min: 0, max: 48, step: 2, unit: 'px' },
    ],
  },
  {
    title: '가독성',
    axis: 'R',
    fields: [
      { kind: 'range', name: '--fs-body', label: '본문 크기', min: 12, max: 20, step: 1, unit: 'px' },
      { kind: 'range', name: '--fs-h1', label: 'H1 크기', min: 24, max: 56, step: 1, unit: 'px' },
      { kind: 'range', name: '--fs-hero', label: '히어로 크기', min: 32, max: 80, step: 2, unit: 'px' },
      { kind: 'range', name: '--lh-body', label: '본문 행간', min: 1.2, max: 2, step: 0.05, unit: '' },
    ],
  },
];

const ALL_FIELDS = GROUPS.flatMap((g) => g.fields);

/** 현재 적용된 계산값을 읽는다 (인라인 오버라이드가 있으면 그 값). */
function readComputed(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** range 필드의 숫자 부분만 뽑는다. */
function toNumber(raw: string): number {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

type BridgeState = 'checking' | 'ready' | 'down' | 'blocked' | 'saving' | 'saved' | 'error';

/**
 * HTTPS 페이지(GitHub Pages 등)에서는 http://127.0.0.1 로의 요청이 Mixed Content 로 차단된다.
 * 이 경우 브리지 저장 경로가 원천적으로 불가능하므로, 시도하지 않고 CSS 복사로 안내한다.
 */
const BRIDGE_BLOCKED = window.location.protocol === 'https:';

/** 조정된 토큰을 tokens.css 에 붙여넣을 수 있는 CSS 블록으로 만든다. */
function toCssBlock(draft: Record<string, string>): string {
  const width = Math.max(...Object.keys(draft).map((k) => k.length));
  const lines = Object.entries(draft)
    .map(([k, v]) => `  ${k}:${' '.repeat(width - k.length + 1)}${v};`)
    .join('\n');
  return `:root {\n${lines}\n}`;
}

export function ThemeTuner() {
  // ?tuner=open 으로 진입하면 패널이 열린 상태로 시작한다 (링크 공유·문서 캡처용)
  const [open, setOpen] = useState(
    () => new URLSearchParams(window.location.search).get('tuner') === 'open',
  );
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [bridge, setBridge] = useState<BridgeState>('checking');
  const [message, setMessage] = useState('');
  /** 패널을 처음 연 시점의 파일 원본값 — "되돌리기" 기준선 */
  const baselineRef = useRef<Record<string, string> | null>(null);

  // 기준선 캡처 + 저장된 draft 복원
  useEffect(() => {
    if (baselineRef.current) return;
    const base: Record<string, string> = {};
    for (const f of ALL_FIELDS) base[f.name] = readComputed(f.name);
    baselineRef.current = base;

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved && typeof saved === 'object' && Object.keys(saved).length) {
        setDraft(saved);
        for (const [k, v] of Object.entries(saved)) {
          document.documentElement.style.setProperty(k, String(v));
        }
      }
    } catch { /* localStorage 접근 불가 시 무시 */ }
  }, []);

  // 브리지 헬스체크 — HTTPS 페이지에서는 Mixed Content 로 차단되므로 시도하지 않는다
  const ping = useCallback(async () => {
    if (BRIDGE_BLOCKED) { setBridge('blocked'); return; }
    try {
      const r = await fetch(`${BRIDGE_URL}/health`, { cache: 'no-store' });
      const j = await r.json();
      setBridge(j.ok && j.ver >= 2 ? 'ready' : 'down');
    } catch {
      setBridge('down');
    }
  }, []);

  useEffect(() => {
    ping();
    if (BRIDGE_BLOCKED) return;
    const t = setInterval(ping, 15000);
    return () => clearInterval(t);
  }, [ping]);

  const apply = useCallback((name: string, value: string) => {
    document.documentElement.style.setProperty(name, value);
    setDraft((prev) => {
      const next = { ...prev, [name]: value };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
    setBridge((b) => (b === 'saved' ? 'ready' : b));
  }, []);

  const reset = useCallback(() => {
    for (const f of ALL_FIELDS) document.documentElement.style.removeProperty(f.name);
    setDraft({});
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    setMessage('파일 원본값으로 되돌렸습니다');
    setBridge((b) => (b === 'saved' ? 'ready' : b));
  }, []);

  const save = useCallback(async () => {
    const changed = Object.keys(draft).length;
    if (!changed) { setMessage('변경된 토큰이 없습니다'); return; }
    setBridge('saving');
    try {
      const r = await fetch(`${BRIDGE_URL}/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'light', tokens: draft }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || String(r.status));
      setBridge('saved');
      setMessage(`✅ tokens.css 에 ${j.applied.length}개 반영 — HMR 로 즉시 적용됩니다`);
      // 파일이 바뀌었으므로 인라인 오버라이드를 걷어내 파일값이 보이게 한다
      setTimeout(() => {
        for (const f of ALL_FIELDS) document.documentElement.style.removeProperty(f.name);
        setDraft({});
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
      }, 600);
    } catch (e) {
      setBridge('error');
      setMessage(`❌ 저장 실패: ${(e as Error).message}`);
    }
  }, [draft]);

  /** 조정값을 CSS 블록으로 클립보드에 복사한다 (브리지를 못 쓰는 환경의 반출 경로). */
  const copy = useCallback(async () => {
    const changed = Object.keys(draft).length;
    if (!changed) { setMessage('변경된 토큰이 없습니다'); return; }
    const block = toCssBlock(draft);
    try {
      // 포커스가 없는 탭에서는 writeText 가 영원히 pending 할 수 있어 타임아웃을 건다
      await Promise.race([
        navigator.clipboard.writeText(block),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
      ]);
      setMessage(`📋 CSS ${changed}줄 복사됨 — tokens.css 의 :root 에 붙여넣으세요`);
    } catch {
      // clipboard 를 쓸 수 없으면 직접 선택·복사할 수 있게 원문을 노출한다
      setMessage(block);
    }
  }, [draft]);

  const changedCount = Object.keys(draft).length;

  const badge = {
    checking: { cls: 'neutral', text: '브리지 확인 중…' },
    ready: { cls: 'ok', text: '● 브리지 연결됨 — 확정 저장 가능' },
    down: { cls: 'warn', text: '○ 브리지 미실행 — bash scripts/start-curation-bridge.sh' },
    blocked: { cls: 'neutral', text: '🔒 배포본 — 조정·복사만 가능 (로컬 저장은 HTTPS 제약)' },
    saving: { cls: 'neutral', text: '⏳ 저장 중…' },
    saved: { cls: 'ok', text: '✅ 저장됨' },
    error: { cls: 'err', text: '❌ 오류' },
  }[bridge];

  if (!open) {
    return (
      <button className="tuner-fab" onClick={() => setOpen(true)} aria-label="테마 조정기 열기">
        🎛 테마 조정
        {changedCount > 0 && <span className="tuner-fab__dot">{changedCount}</span>}
      </button>
    );
  }

  return (
    <aside className="tuner" aria-label="라이브 토큰 조정기">
      <header className="tuner__head">
        <div>
          <div className="tuner__title">🎛 테마 조정기</div>
          <div className={`tuner__badge tuner__badge--${badge.cls}`}>{badge.text}</div>
        </div>
        <button className="tuner__close" onClick={() => setOpen(false)} aria-label="닫기">✕</button>
      </header>

      <div className="tuner__body">
        {GROUPS.map((group) => (
          <section key={group.title} className="tuner__group">
            <h3 className="tuner__group-title">
              <span className="tuner__axis">{group.axis}</span>
              {group.title}
            </h3>
            {group.fields.map((f) => {
              const current = draft[f.name] ?? readComputed(f.name);
              return (
                <div key={f.name} className="tuner__field">
                  <label className="tuner__label" htmlFor={f.name}>
                    {f.label}
                    <code className="tuner__var">{f.name}</code>
                  </label>
                  {f.kind === 'color' ? (
                    <div className="tuner__control">
                      <input
                        id={f.name}
                        type="color"
                        value={current.startsWith('#') ? current : '#000000'}
                        onChange={(e) => apply(f.name, e.target.value.toUpperCase())}
                      />
                      <span className="tuner__value">{current}</span>
                    </div>
                  ) : (
                    <div className="tuner__control">
                      <input
                        id={f.name}
                        type="range"
                        min={f.min}
                        max={f.max}
                        step={f.step}
                        value={toNumber(current)}
                        onChange={(e) => apply(f.name, `${e.target.value}${f.unit}`)}
                      />
                      <span className="tuner__value">{current}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}

        <p className="tuner__note">
          레이아웃(L) 축은 마크업 구조라 여기서 바꿀 수 없습니다. 벤토 ↔ 분할 같은 변경은 코드 수정이 필요합니다.
        </p>
      </div>

      <footer className="tuner__foot">
        {message && <div className="tuner__msg">{message}</div>}
        <div className="tuner__actions">
          <button className="tuner__btn" onClick={reset} disabled={!changedCount}>
            되돌리기
          </button>
          <button
            className={`tuner__btn${BRIDGE_BLOCKED ? ' tuner__btn--primary' : ''}`}
            onClick={copy}
            disabled={!changedCount}
            title="조정값을 CSS 블록으로 클립보드에 복사"
          >
            CSS 복사 {changedCount > 0 && `(${changedCount})`}
          </button>
          {!BRIDGE_BLOCKED && (
            <button
              className="tuner__btn tuner__btn--primary"
              onClick={save}
              disabled={bridge !== 'ready' || !changedCount}
            >
              확정 저장 {changedCount > 0 && `(${changedCount})`}
            </button>
          )}
        </div>
      </footer>
    </aside>
  );
}
