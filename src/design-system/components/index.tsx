/**
 * D2A · Tier M 프리미티브 컴포넌트
 * 모든 스타일은 tokens.css 의 CSS 변수 참조.
 */
import type {
  ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes,
  ReactNode, TableHTMLAttributes,
} from 'react';
import { useEffect } from 'react';
import './components.css';

/* ═══ Button ═══════════════════════════════════════════════ */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}
export function Button({
  variant = 'primary', size = 'md', leadingIcon, trailingIcon, className, children, ...rest
}: ButtonProps) {
  const cls = ['ds-btn', `ds-btn--${size}`, `ds-btn--${variant}`, className].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}

/* ═══ Card ═════════════════════════════════════════════════ */
type Elevation = 0 | 1 | 2 | 3;
type Padding = 'sm' | 'md' | 'lg';
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation;
  padding?: Padding;
  interactive?: boolean;
}
export function Card({
  elevation = 1, padding = 'md', interactive = false, className, children, ...rest
}: CardProps) {
  const cls = [
    'ds-card', `ds-card--elev-${elevation}`, `ds-card--pad-${padding}`,
    interactive ? 'ds-card--interactive' : '', className,
  ].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}

/* ═══ Input ════════════════════════════════════════════════ */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  error?: boolean;
}
export function Input({ size = 'md', error = false, className, ...rest }: InputProps) {
  const cls = [
    'ds-input', `ds-input--${size}`, error ? 'ds-input--error' : '', className,
  ].filter(Boolean).join(' ');
  return <input className={cls} {...rest} />;
}

/* ═══ Text ═════════════════════════════════════════════════ */
type TextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'body-lg' | 'caption';
type TextColor = 'strong' | 'muted' | 'subtle';
export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  color?: TextColor;
  num?: boolean;
}
export function Text({
  variant = 'body', as, color, num = false, className, children, ...rest
}: TextProps) {
  const Tag = as || (variant === 'h1' ? 'h1' : variant === 'h2' ? 'h2' : variant === 'h3' ? 'h3' : 'p');
  const cls = [
    'ds-text', `ds-text--${variant}`, color && color !== 'strong' ? `ds-text--${color}` : '',
    num ? 'ds-text--num' : '', className,
  ].filter(Boolean).join(' ');
  return <Tag className={cls} {...rest}>{children}</Tag>;
}

/* ═══ Stack ════════════════════════════════════════════════ */
type Direction = 'row' | 'col';
type Gap = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Align = 'start' | 'center' | 'end';
type Justify = 'start' | 'center' | 'between' | 'end';
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: Direction;
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
}
export function Stack({
  direction = 'col', gap = 3, align, justify, wrap = false, className, children, ...rest
}: StackProps) {
  const cls = [
    'ds-stack', `ds-stack--${direction}`, `ds-stack--gap-${gap}`,
    align ? `ds-stack--align-${align}` : '',
    justify ? `ds-stack--justify-${justify}` : '',
    wrap ? 'ds-stack--wrap' : '', className,
  ].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}

/* ═══ Grid ═════════════════════════════════════════════════ */
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: number | string;
  gap?: 3 | 4 | 5 | 6;
}
export function Grid({ cols = 3, gap = 4, className, style, children, ...rest }: GridProps) {
  const cls = ['ds-grid', `ds-grid--gap-${gap}`, className].filter(Boolean).join(' ');
  const gridStyle = {
    gridTemplateColumns: typeof cols === 'number' ? `repeat(${cols}, 1fr)` : cols,
    ...style,
  };
  return <div className={cls} style={gridStyle} {...rest}>{children}</div>;
}

/* ═══ Divider ══════════════════════════════════════════════ */
type DividerOrientation = 'h' | 'v';
export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: DividerOrientation;
  strong?: boolean;
}
export function Divider({ orientation = 'h', strong = false, className, ...rest }: DividerProps) {
  const cls = [
    'ds-divider', `ds-divider--${orientation}`, strong ? 'ds-divider--strong' : '', className,
  ].filter(Boolean).join(' ');
  return <hr className={cls} {...rest} />;
}

/* ═══ Tag ══════════════════════════════════════════════════ */
type TagTone = 'neutral' | 'primary' | 'sage' | 'live' | 'warn' | 'danger' | 'info';
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
}
export function Tag({ tone = 'neutral', className, children, ...rest }: TagProps) {
  const cls = ['ds-tag', `ds-tag--${tone}`, className].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
}

/* ═══ Icon ═════════════════════════════════════════════════ */
type IconName = 'home' | 'bell' | 'play' | 'live' | 'chevron-right' | 'user' | 'gift' | 'search';
export interface IconProps extends HTMLAttributes<SVGElement> {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}
const iconPaths: Record<IconName, string> = {
  'home': 'M3 12l9-9 9 9M5 10v10h14V10',
  'bell': 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  'play': 'M5 3l14 9-14 9V3z',
  'live': 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M6.34 6.34a8 8 0 0 0 0 11.32M17.66 6.34a8 8 0 0 1 0 11.32',
  'chevron-right': 'M9 6l6 6-6 6',
  'user': 'M20 21a8 8 0 0 0-16 0M16 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0',
  'gift': 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  'search': 'M11 19a8 8 0 1 0 0-16a8 8 0 0 0 0 16zM21 21l-4.35-4.35',
};
export function Icon({ name, size = 'md', className, ...rest }: IconProps) {
  const cls = ['ds-icon', `ds-icon--${size}`, className].filter(Boolean).join(' ');
  return (
    <svg
      className={cls} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" {...rest}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

/* ═══ Toast ════════════════════════════════════════════════ */
type ToastTone = 'success' | 'warning' | 'error' | 'info';
export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  tone?: ToastTone;
  icon?: ReactNode;
}
export function Toast({ tone = 'info', icon, className, children, ...rest }: ToastProps) {
  const cls = ['ds-toast', `ds-toast--${tone}`, className].filter(Boolean).join(' ');
  return (
    <div className={cls} role="status" {...rest}>
      {icon && <span className="ds-toast__ico">{icon}</span>}
      <span className="ds-toast__msg">{children}</span>
    </div>
  );
}

/* ═══ Dialog ═══════════════════════════════════════════════ */
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
}
export function Dialog({ open, onClose, title, children, actions }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="ds-dialog-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="ds-dialog" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="ds-dialog__title">{title}</h2>}
        {children && <div className="ds-dialog__body">{children}</div>}
        {actions && <div className="ds-dialog__actions">{actions}</div>}
      </div>
    </div>
  );
}

/* ═══ Table ════════════════════════════════════════════════ */
export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {}
export function Table({ className, children, ...rest }: TableProps) {
  const cls = ['ds-table', className].filter(Boolean).join(' ');
  return <table className={cls} {...rest}>{children}</table>;
}
