export const theme = {
  colors: {
    bg: '#05060a',
    gold: '#d9c8a9',
    blue: '#d9c8a9', // In original CSS: --blue:#d9c8a9;--gold:#d9c8a9
    white: '#ffffff',
    textLight: '#c9d0e0',
    textMuted: '#9aa3b8',
    borderDark: '#222222',
    borderDivider: '#333333',
    borderButton: '#555555',
    cardBg: 'rgba(255, 255, 255, 0.04)',
    cursorShadowInner: 'rgba(217, 200, 169, 0.25)',
    cursorShadowOuter: 'rgba(217, 200, 169, 0.5)',
  },
  fonts: {
    display: "'Anton', Impact, sans-serif",
    body: "'Montserrat', system-ui, sans-serif",
  },
  breakpoints: {
    mobile: '800px',
  },
} as const;

export type Theme = typeof theme;
