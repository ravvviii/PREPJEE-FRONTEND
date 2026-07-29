export const COLORS = {
  light: {
    HomeBG: '#f6f7f7',
    Primary: '#6366f1',
    AppBackground: '#09090b',
    NavBG: '#FFFFFF',
    NavBottomLine:'#0D0C0D'
  },
  dark: {
    HomeBG: '#09090b',
    Primary: '#6366f1',
    AppBackground: '#09090b',
    NavBG: '#09090b',
    NavBottomLine:'#FFFFFF'
  },
};

export const DEFAULT_THEME = 'light';

export const THEME_COLOR_TOKENS = {
  background: '--background',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  popover: '--popover',
  popoverForeground: '--popover-foreground',
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  destructive: '--destructive',
  success: '--success',
  successForeground: '--success-foreground',
  warning: '--warning',
  warningForeground: '--warning-foreground',
  border: '--border',
  input: '--input',
  ring: '--ring',
};

export const THEME_COLORS = {
  custom: COLORS,
  external: {
    primary: COLORS.light.Primary,
    background: COLORS.light.AppBackground,
  },
  css: Object.fromEntries(
    Object.entries(THEME_COLOR_TOKENS).map(([name, variable]) => [name, `var(${variable})`])
  ),
  className: {
    background: 'bg-background',
    foreground: 'text-foreground',
    card: 'bg-card',
    cardForeground: 'text-card-foreground',
    primary: 'bg-primary',
    primaryText: 'text-primary',
    primaryForeground: 'text-primary-foreground',
    secondary: 'bg-secondary',
    secondaryForeground: 'text-secondary-foreground',
    muted: 'bg-muted',
    mutedForeground: 'text-muted-foreground',
    accent: 'bg-accent',
    accentForeground: 'text-accent-foreground',
    destructive: 'bg-destructive',
    success: 'bg-success',
    warning: 'bg-warning',
    border: 'border-border',
    ring: 'ring-ring',
  },
};

export function color(name, theme = DEFAULT_THEME) {
  return COLORS[theme]?.[name] ?? COLORS[DEFAULT_THEME]?.[name];
}

export function bgColor(name, theme = DEFAULT_THEME) {
  return { backgroundColor: color(name, theme) };
}

export function textColor(name, theme = DEFAULT_THEME) {
  return { color: color(name, theme) };
}

export function cssColor(name, theme = DEFAULT_THEME) {
  return color(name, theme) ?? THEME_COLORS.css[name];
}

export function themeClass(name) {
  return THEME_COLORS.className[name];
}
