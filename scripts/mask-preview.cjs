#!/usr/bin/env node
/**
 * 조합 시안(원본) → 공개용 마스킹 사본 생성
 *
 * 이 리포는 **공개**다. 원본 시안은 사내 서비스 화면이라 그대로 올릴 수 없다.
 * 손으로 지우면 빠뜨리므로, 치환 규칙을 여기 한 곳에 두고 매번 이 스크립트로 만든다.
 *
 * 두 단계로 지운다:
 *   1) 식별자   — 서비스명·게임명·앱명. 남으면 곧바로 어디인지 특정된다.
 *   2) 기능 어휘 — "OX 퀴즈"·"드롭스" 같은 고유 기능 명칭과 방송 제목.
 *                  레이아웃·토큰 검증에는 필요 없고, 서비스 특성만 드러낸다.
 *
 * 사용:
 *   node scripts/mask-preview.cjs <원본 composition-preview.html 경로>
 *   node scripts/mask-preview.cjs <경로> --check   치환 후에도 금칙어가 남으면 exit 1
 */

const fs = require('node:fs');
const path = require('node:path');

const OUT = path.join(__dirname, '..', 'public', 'composition-preview.html');

/** 1단계 — 식별자. 순서 중요: 긴 것부터 (부분 치환으로 뭉개지지 않게) */
const IDENTIFIERS = [
  ['넥슨플레이 앱', '파트너 앱'],
  ['넥슨 GNB', '공통 GNB'],
  ['넥슨라이브', 'D2A Live'],
  ['넥슨', 'D2A'],
  ['NX<em>ON</em>', 'D2A<em>ON</em>'],
  ['메이플스토리', 'Sports Channel A'],
  ['메이플 공식 방송', 'Sports Channel A 공식 방송'],
  ['메이플 M', 'Sports Channel A+'],
  ['메이플M', 'Sports Channel A+'],
  ['FC 온라인', 'Sports Channel B'],
  ['던전앤파이터', 'Culture Channel'],
  ['던파', 'Culture Channel'],
  ['바람의나라: 연', 'Music Channel'],
  ['바람의나라', 'Music Channel'],
  ['카트라이더', 'Variety Channel'],
  ['도미네이터', '메인 프로그램'],
];

/** 아바타 이니셜 배지 — 태그 안에 갇힌 2글자만 바꾼다 (본문 단어 훼손 방지) */
const INITIALS = [
  ['>MS<', '>SA<'], ['>FC<', '>SB<'], ['>DF<', '>CC<'],
  ['>BR<', '>MC<'], ['>MM<', '>SA+<'], ['>CN<', '>VC<'],
];

/** 2단계 — 기능 어휘·방송 제목. 구조는 그대로 두고 서비스 특성만 지운다 */
const VOCABULARY = [
  ['OX 퀴즈 진행 중', '실시간 참여 진행 중'],
  ['OX 퀴즈', '참여형'],
  ['보상 지급', '리워드 지급'],
  ['보상 · 성공', '성공 · 긍정'],
  ['드롭스', '혜택'],
  ['>보상<', '>리워드<'],
  ['보상·성공', '성공·긍정'],
  ['보상 지급', '리워드 지급'],
  ['방송 시작 알림 켜기', '시작 알림 받기'],
  ['관심 게임을 등록하면 파트너 앱으로 알림이 옵니다.', '채널을 구독하면 앱으로 알림이 옵니다.'],
  ['최근에 업로드된 방송을 게임별로 필터링해 시청할 수 있어요.', '최근 업로드된 방송을 채널별로 필터링해 볼 수 있어요.'],
  ['이벤트 참여 내역', '참여 내역'],
  ['방송 많은 순으로 정렬됨', '활성 순 정렬'],
  ['신규 각성 시연회', '신규 기능 시연회'],
  ['신규 각성 시연', '신규 기능 시연'],
  ['신규 캐릭터 리뷰 방송', '신규 콘텐츠 리뷰 방송'],
  ['유저 콜라보', '커뮤니티 콜라보'],
  ['유저 반응 실시간 투표', '실시간 반응 투표'],
  ['>Games<', '>Channels<'],
];

/** 치환 후에도 남으면 안 되는 금칙어 */
const FORBIDDEN = /넥슨|메이플|던파|던전앤파이터|FC 온라인|바람의나라|카트라이더|도미네이터|NX<em>|OX 퀴즈|드롭스|각성/;

function main() {
  const [srcArg] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const check = process.argv.includes('--check');
  if (!srcArg) {
    console.error('사용: node scripts/mask-preview.cjs <원본 composition-preview.html 경로> [--check]');
    process.exit(1);
  }
  const src = path.resolve(srcArg);
  if (!fs.existsSync(src)) {
    console.error(`[mask-preview] 원본 없음: ${src}`);
    process.exit(1);
  }

  let html = fs.readFileSync(src, 'utf8');
  const applied = [];
  for (const [from, to] of [...IDENTIFIERS, ...INITIALS, ...VOCABULARY]) {
    if (html.includes(from)) applied.push(from);
    html = html.split(from).join(to);
  }
  html = html.replace('<title>D2A Live · 조합 시안', '<title>D2A · 조합 시안');

  const leftover = html.match(FORBIDDEN);
  if (leftover) {
    console.error(`[mask-preview] ❌ 금칙어가 남았습니다: ${leftover[0]}`);
    console.error('  치환 규칙을 보완한 뒤 다시 실행하세요. 공개 리포이므로 그대로 배포하지 않습니다.');
    process.exit(1);
  }

  if (check) {
    const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    if (cur !== html) {
      console.error('[mask-preview] ❌ 공개 사본이 원본과 어긋납니다 — 재생성하세요');
      process.exit(1);
    }
    console.log('[mask-preview] ✅ 공개 사본 최신');
    return;
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, html, 'utf8');
  console.log(`[mask-preview] ${path.relative(path.join(__dirname, '..'), OUT)}`);
  console.log(`  치환 규칙 ${applied.length}/${IDENTIFIERS.length + INITIALS.length + VOCABULARY.length}건 적용 · 금칙어 0건`);
}

main();
