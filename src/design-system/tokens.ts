/**
 * D2A · 디자인 토큰 (TS 상수)
 * SSOT: tokens.css. 이 파일은 TS 참조용 미러다.
 * 두 파일 값이 갈리면 tokens.css 가 우선한다.
 */

export const color = {
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  surfaceAlt: 'var(--color-surface-alt)',
  border: 'var(--color-border)',
  borderStrong: 'var(--color-border-strong)',
  textStrong: 'var(--color-text-strong)',
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  textSubtle: 'var(--color-text-subtle)',
  textInverse: 'var(--color-text-inverse)',
  primary: 'var(--color-primary)',
  primaryStrong: 'var(--color-primary-strong)',
  primarySoft: 'var(--color-primary-soft)',
  sage: 'var(--color-sage)',
  sageStrong: 'var(--color-sage-strong)',
  sageSoft: 'var(--color-sage-soft)',
  live: 'var(--color-live)',
  liveStrong: 'var(--color-live-strong)',
  liveSoft: 'var(--color-live-soft)',
  warn: 'var(--color-warn)',
  warnStrong: 'var(--color-warn-strong)',
  warnSoft: 'var(--color-warn-soft)',
  danger: 'var(--color-danger)',
  dangerStrong: 'var(--color-danger-strong)',
  dangerSoft: 'var(--color-danger-soft)',
  info: 'var(--color-info)',
  infoSoft: 'var(--color-info-soft)',
} as const;

export const space = {
  1: 'var(--sp-1)', 2: 'var(--sp-2)', 3: 'var(--sp-3)', 4: 'var(--sp-4)',
  5: 'var(--sp-5)', 6: 'var(--sp-6)', 7: 'var(--sp-7)', 8: 'var(--sp-8)', 9: 'var(--sp-9)',
} as const;

export const radius = {
  xs: 'var(--radius-xs)', sm: 'var(--radius-sm)', md: 'var(--radius-md)',
  lg: 'var(--radius-lg)', xl: 'var(--radius-xl)', full: 'var(--radius-full)',
} as const;

export const shadow = {
  0: 'var(--shadow-0)', 1: 'var(--shadow-1)', 2: 'var(--shadow-2)', 3: 'var(--shadow-3)',
} as const;

export const font = {
  body: 'var(--font-body)',
  num: 'var(--font-num)',
} as const;

export const fontSize = {
  xs: 'var(--fs-xs)', sm: 'var(--fs-sm)', body: 'var(--fs-body)', lg: 'var(--fs-lg)',
  h3: 'var(--fs-h3)', h2: 'var(--fs-h2)', h1: 'var(--fs-h1)', hero: 'var(--fs-hero)',
} as const;

export const fontWeight = {
  regular: 'var(--fw-regular)', medium: 'var(--fw-medium)',
  semibold: 'var(--fw-semibold)', bold: 'var(--fw-bold)',
} as const;

export const lineHeight = {
  tight: 'var(--lh-tight)', heading: 'var(--lh-heading)',
  body: 'var(--lh-body)', relaxed: 'var(--lh-relaxed)',
} as const;

export const layout = {
  contentMaxW: 'var(--layout-content-max-w)',
  sidebarW: 'var(--layout-sidebar-w)',
  gnbH: 'var(--layout-gnb-h)',
} as const;

export const transition = {
  fast: 'var(--transition-fast)',
  base: 'var(--transition-base)',
  slow: 'var(--transition-slow)',
} as const;

export type ColorToken = keyof typeof color;
export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radius;
