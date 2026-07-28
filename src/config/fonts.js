export const FONT_CLASS = {
  ui: 'font-sans',
  mono: 'font-mono',
  heading: 'font-heading',
  meta: 'font-meta',
};

export const FONT_TRACKING = {
  tight: 'tracking-[0.06em]',
  normal: 'tracking-[0.1em]',
  wide: 'tracking-[0.16em]',
};

export function metaFont(className = '') {
  return ['font-meta', className].filter(Boolean).join(' ');
}
