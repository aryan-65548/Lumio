export interface ThemeConfig {
  id: 'goa' | 'aot';
  name: string;
  colors: {
    primary: string;       // main text/primary color
    secondary: string;     // secondary highlights
    accent1: string;       // first accent color (pink for goa, red for aot)
    accent2: string;       // second accent (blue for goa, orange for aot)
    bg: string;            // content background base
    text: string;          // default text color
    muted: string;         // muted text/labels
    border: string;        // border colors
  };
  typography: {
    displayFont: string;   // font-family class for main headers
    sansFont: string;      // font-family class for readable inputs/body
    accentFont?: string;   // font-family class for handwritten/cinematic overlays
  };
  background: {
    cssGradient: string;   // raw background CSS gradient
    noiseOpacity: number;  // film grain/noise overlays
  };
  cardDesign: {
    frameBg: string;       // CSS background for the preview card container
    frameBorder: string;   // border styles for the preview card container
    aspectRatio: string;   // standard 4:5 or 1080x1350 equivalent
    pfpPosition: {
      width: number;
      height: number;
      top: number;
      left: number;
    };
    badgeText: string;
  };
}

export type ThemeType = 'goa' | 'aot';
