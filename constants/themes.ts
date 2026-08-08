import { ThemeConfig } from '../types/theme';

export const THEMES: Record<'goa' | 'aot', ThemeConfig> = {
  goa: {
    id: 'goa',
    name: '🌴 Goa Beach',
    colors: {
      primary: '#083C26',
      secondary: '#FFE566',
      accent1: '#FF2E93',
      accent2: '#00A3E0',
      bg: '#F5F2EB',
      text: '#083C26',
      muted: '#3D6852',
      border: '#083C26'
    },
    typography: {
      displayFont: 'font-serif font-black tracking-tight uppercase',
      sansFont: 'font-sans font-medium',
      accentFont: 'font-handwriting'
    },
    background: {
      cssGradient: 'linear-gradient(135deg, #FFF9E6 0%, #FFF0F5 50%, #E6F7FF 100%)',
      noiseOpacity: 0.04
    },
    cardDesign: {
      frameBg: '#FFFDF9',
      frameBorder: '8px solid #083C26',
      aspectRatio: 'aspect-[4/5]',
      pfpPosition: {
        width: 660,
        height: 660,
        top: 260,
        left: 210
      },
      badgeText: 'GOA 2026'
    }
  },
  aot: {
    id: 'aot',
    name: '⚔ Attack On Titan',
    colors: {
      primary: '#F2EFE9',
      secondary: '#E05A1F',
      accent1: '#B22222',
      accent2: '#1B3B48',
      bg: '#0A0E12',
      text: '#F2EFE9',
      muted: '#8B959A',
      border: '#B22222'
    },
    typography: {
      displayFont: 'font-serif tracking-widest uppercase font-extrabold font-cinzel',
      sansFont: 'font-sans font-normal',
      accentFont: 'font-cinzel'
    },
    background: {
      cssGradient: 'linear-gradient(185deg, #07090C 0%, #0F161E 60%, #1A120E 100%)',
      noiseOpacity: 0.12
    },
    cardDesign: {
      frameBg: '#131921',
      frameBorder: '6px solid #F2EFE9',
      aspectRatio: 'aspect-[4/5]',
      pfpPosition: {
        width: 700,
        height: 700,
        top: 240,
        left: 190
      },
      badgeText: 'SURVIVAL'
    }
  }
};
export type ThemeId = keyof typeof THEMES;
export const DEFAULT_THEME: ThemeId = 'goa';
export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1350;
