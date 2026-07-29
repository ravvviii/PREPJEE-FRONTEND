'use client';

import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { COLORS, DEFAULT_THEME, THEME_COLORS, THEME_COLOR_TOKENS, themeClass } from '@/config/theme';

function readCssVariable(variable) {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

export function useThemeColors() {
  const { resolvedTheme } = useTheme();
  const activeTheme = resolvedTheme === 'dark' ? 'dark' : DEFAULT_THEME;

  return useMemo(
    () => {
      const getColor = (name) => COLORS[activeTheme]?.[name] ?? COLORS[DEFAULT_THEME]?.[name];

      return {
        theme: activeTheme,
        customColors: COLORS,
        colors: THEME_COLORS,
        color: getColor,
        bgColor(name) {
          return { backgroundColor: getColor(name) };
        },
        textColor(name) {
          return { color: getColor(name) };
        },
        cssColor(name) {
          return getColor(name) ?? `var(${THEME_COLOR_TOKENS[name]})`;
        },
        themeClass,
        value(name) {
          const variable = THEME_COLOR_TOKENS[name];
          return variable ? readCssVariable(variable) : '';
        },
      };
    },
    [activeTheme]
  );
}
