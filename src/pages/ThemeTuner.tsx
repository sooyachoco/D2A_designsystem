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
  | { kind: 'range'; name: string; label: string; min: number; max: number; step: number; unit: string }
  | { kind: 'select'; name: string; label: string; options: { value: string; label: string }[] };

type Group = { title: string; axis: string; fields: Field[] };
type Tab = { id: string; label: string; hint: string; groups: Group[] };

const GLOBAL_GROUPS: Group[] = [
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

/**
 * 콘텐츠(L3) 치수 슬롯 — 레이아웃의 "파라미터" 층.
 * 구조(벤토 ↔ 분할 ↔ 스택)는 마크업이라 여기서 바꿀 수 없다.
 */
const CONTENT_GROUPS: Group[] = [
  {
    title: '히어로',
    axis: 'L',
    fields: [
      {
        kind: 'select', name: '--hero-aspect', label: '비율',
        options: [
          { value: '21/9', label: '21:9 · 시네마틱' },
          { value: '2/1', label: '2:1' },
          { value: '16/9', label: '16:9 · 표준' },
          { value: '3/2', label: '3:2' },
          { value: '4/3', label: '4:3 · 세로 여유' },
        ],
      },
      { kind: 'range', name: '--hero-min-h', label: '최소 높이', min: 240, max: 640, step: 10, unit: 'px' },
      { kind: 'range', name: '--hero-max-h', label: '최대 높이', min: 400, max: 900, step: 10, unit: 'px' },
    ],
  },
  {
    title: '그리드',
    axis: 'L',
    fields: [
      { kind: 'range', name: '--grid-columns', label: '벤토 컬럼 수', min: 3, max: 8, step: 1, unit: '' },
      { kind: 'range', name: '--grid-row-h', label: '벤토 행 높이', min: 80, max: 200, step: 4, unit: 'px' },
      { kind: 'range', name: '--card-grid-cols', label: '카드 그리드 열 수', min: 1, max: 4, step: 1, unit: '' },
    ],
  },
  {
    title: '미디어 · 내비',
    axis: 'L',
    fields: [
      {
        kind: 'select', name: '--media-aspect', label: '썸네일 비율',
        options: [
          { value: '16/9', label: '16:9 · 표준' },
          { value: '3/2', label: '3:2' },
          { value: '4/3', label: '4:3' },
          { value: '1/1', label: '1:1 · 정사각' },
        ],
      },
      { kind: 'range', name: '--layout-sidebar-w', label: 'LNB 폭', min: 160, max: 320, step: 4, unit: 'px' },
      { kind: 'range', name: '--layout-gnb-h', label: 'GNB 높이', min: 44, max: 96, step: 2, unit: 'px' },
    ],
  },
];

const TABS: Tab[] = [
  {
    id: 'global', label: '전역', groups: GLOBAL_GROUPS,
    hint: '색·모양·타이포 — 화면 전체에 적용됩니다.',
  },
  {
    id: 'content', label: '콘텐츠', groups: CONTENT_GROUPS,
    hint: '레이아웃 치수 — 구조(벤토 ↔ 분할 ↔ 스택)는 마크업이라 여기서 바꿀 수 없습니다.',
  },
];

const ALL_FIELDS = TABS.flatMap((t) => t.groups.flatMap((g) => g.fields));

/** 현재 적용된 계산값을 읽는다 (인라인 오버라이드가 있으면 그 값). */
function readComputed(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** range 필드의 숫자 부분만 뽑는다. */
function toNumber(raw: string): number {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

/** 비율 값 비교 — 브라우저가 "21/9" 를 "21 / 9" 로 돌려주기도 한다. */
function sameRatio(a: string, b: string): boolean {
  return a.replace(/\s+/g, '') === b.replace(/\s+/g, '');
}

type BridgeState = 'checking' | 'ready' | 'down' | 'blocked' | 'saving' | 'saved' | 'error';

/**
 * HTTPS 페이지(GitHub Pages 등)에서는 http://127.0.0.1 로의 요청이 Mixed Content 로 차단된다.
 * 이 경우 브리지 저장 경로가 원천적으로 불가능하므로, 시도하지 않고 "확정"을 CSS 복사로 처리한다.
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
  // ?tab=content 로 특정 탭을 열어둘 수 있다 (링크 공유·문서 캡처용)
  const [tabId, setTabId] = useState<string>(() => {
    const q = new URLSearchParams(window.location.search).get('tab');
    return TABS.some((t) => t.id === q) ? (q as string) : 'global';
  });
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

  /** 조정값을 CSS 블록으로 클립보드에 복사한다 (브리지를 못 쓰는 환경의 확정 경로). */
  const copyToClipboard = useCallback(async () => {
    const changed = Object.keys(draft).length;
    if (!changed) { setMessage('변경된 토큰이 없습니다'); return; }
    const block = toCssBlock(draft);
    try {
      // 포커스가 없는 탭에서는 writeText 가 영원히 pending 할 수 있어 타임아웃을 건다
      await Promise.race([
        navigator.clipboard.writeText(block),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
      ]);
      setMessage(`📋 확정값 ${changed}개를 복사했습니다 — tokens.css 의 :root 에 붙여넣으세요`);
    } catch {
      // clipboard 를 쓸 수 없으면 직접 선택·복사할 수 있게 원문을 노출한다
      setMessage(block);
    }
  }, [draft]);

  /** 브리지로 파일에 쓸 수 있는 상태인가 — "확정"이 저장이 될지 복사가 될지를 가른다 */
  const canSaveToFile = !BRIDGE_BLOCKED && (bridge === 'ready' || bridge === 'error');

  /**
   * 사용자가 하려는 일은 언제나 "이 값으로 확정"이다.
   * 그것이 파일 저장인지 클립보드 복사인지는 환경이 정하므로 버튼은 하나로 둔다
   * (어느 쪽이 될지는 누르기 전에 헤더 배지가 알려준다).
   */
  const confirmChanges = useCallback(
    () => (canSaveToFile ? save() : copyToClipboard()),
    [canSaveToFile, save, copyToClipboard],
  );

  const changedCount = Object.keys(draft).length;
  const activeTab = TABS.find((t) => t.id === tabId) ?? TABS[0];
  /** 탭별 변경 건수 — 다른 탭에 조정이 숨어 있어도 보이게 한다 */
  const tabCounts = Object.fromEntries(
    TABS.map((t) => [
      t.id,
      t.groups.flatMap((g) => g.fields).filter((f) => draft[f.name] !== undefined).length,
    ]),
  );

  const badge = {
    checking: { cls: 'neutral', text: '브리지 확인 중…' },
    ready: { cls: 'ok', text: '● 브리지 연결됨 — 확정하면 tokens.css 에 저장됩니다' },
    down: { cls: 'warn', text: '○ 브리지 미실행 — 확정하면 CSS 로 복사됩니다 (저장하려면 bash scripts/start-curation-bridge.sh)' },
    blocked: { cls: 'neutral', text: '🔒 배포본 — 확정하면 CSS 로 복사됩니다 (파일 저장은 HTTPS 제약)' },
    saving: { cls: 'neutral', text: '⏳ 저장 중…' },
    saved: { cls: 'ok', text: '✅ 저장됨' },
    error: { cls: 'err', text: '❌ 오류 — 다시 확정하면 재시도합니다' },
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

      <nav className="tuner__tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === tabId}
            className={`tuner__tab${t.id === tabId ? ' on' : ''}`}
            onClick={() => setTabId(t.id)}
          >
            {t.label}
            {tabCounts[t.id] > 0 && <span className="tuner__tab-n">{tabCounts[t.id]}</span>}
          </button>
        ))}
      </nav>

      <div className="tuner__body">
        {activeTab.groups.map((group) => (
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
                  {f.kind === 'color' && (
                    <div className="tuner__control">
                      <input
                        id={f.name}
                        type="color"
                        value={current.startsWith('#') ? current : '#000000'}
                        onChange={(e) => apply(f.name, e.target.value.toUpperCase())}
                      />
                      <span className="tuner__value">{current}</span>
                    </div>
                  )}
                  {f.kind === 'range' && (
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
                  {f.kind === 'select' && (
                    <div className="tuner__control">
                      <select
                        id={f.name}
                        className="tuner__select"
                        value={f.options.find((o) => sameRatio(o.value, current))?.value ?? f.options[0].value}
                        onChange={(e) => apply(f.name, e.target.value)}
                      >
                        {f.options.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <span className="tuner__value">{current}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}

        <p className="tuner__note">{activeTab.hint}</p>
      </div>

      <footer className="tuner__foot">
        {message && <div className="tuner__msg">{message}</div>}
        <div className="tuner__actions">
          <button className="tuner__btn" onClick={reset} disabled={!changedCount}>
            되돌리기
          </button>
          <button
            className="tuner__btn tuner__btn--primary"
            onClick={confirmChanges}
            disabled={!changedCount || bridge === 'saving'}
            title={
              canSaveToFile
                ? '조정값을 tokens.css 에 저장'
                : '조정값을 CSS 블록으로 클립보드에 복사 (파일 저장 불가 환경)'
            }
          >
            확정 {changedCount > 0 && `(${changedCount})`}
          </button>
        </div>
      </footer>
    </aside>
  );
}
