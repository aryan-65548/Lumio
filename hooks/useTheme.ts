'use client';

import { useState, useEffect } from 'react';
import { ThemeType } from '../types/theme';
import { THEMES } from '../constants/themes';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeType>('goa');

  useEffect(() => {
    // Load initial theme from localStorage if available
    const saved = localStorage.getItem('hackerhouse-theme') as ThemeType;
    if (saved === 'goa' || saved === 'aot') {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('hackerhouse-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const themeConfig = THEMES[theme];

  return {
    theme,
    themeConfig,
    setTheme,
    isGoa: theme === 'goa',
    isAot: theme === 'aot'
  };
}
