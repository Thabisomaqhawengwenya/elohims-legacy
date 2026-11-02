export interface Theme {
  mode: 'dark' | 'light';
  colors: {
    bg: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    gold: string;
    blue: string;
    white: string;
    borderLight: string;
    borderMedium: string;
    cardBg: string;
    cardBorder: string;
    cardShadow: string;
    cardText: string;
    swatchStageBg: string;
    swatchBorder: string;
    btnPrimaryBg: string;
    btnPrimaryText: string;
    btnHoverBg: string;
    btnDisabledBg: string;
    btnShadow: string;
    sizeBtnBg: string;
    navBg: string;
    navBorder: string;
    footerBg: string;
    footerShadow: string;
    outlineStroke: string;
    headingShadow: string;
    goldShadow: string;
    cursorOuter: string;
    cursorInner: string;
    isLight: boolean;
  };
  fonts: {
    display: string;
    body: string;
  };
  breakpoints: {
    mobile: string;
  };
}

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    bg: '#05060a',
    textPrimary: '#ffffff',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    gold: '#d9c8a9',
    blue: '#d9c8a9',
    white: '#ffffff',
    borderLight: 'rgba(255, 255, 255, 0.1)',
    borderMedium: 'rgba(255, 255, 255, 0.25)',
    cardBg: '#141720',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    cardShadow: '0 16px 36px rgba(0, 0, 0, 0.55)',
    cardText: '#ffffff',
    swatchStageBg:
      'radial-gradient(circle at 50% 45%, #d8dade 0%, #b8bcc3 100%)',
    swatchBorder: 'rgba(255, 255, 255, 0.1)',
    btnPrimaryBg: '#ffffff',
    btnPrimaryText: '#000000',
    btnHoverBg: '#e2e8f0',
    btnDisabledBg: 'rgba(255, 255, 255, 0.05)',
    btnShadow: '0 4px 20px rgba(217, 200, 169, 0.35)',
    sizeBtnBg: 'rgba(15, 17, 24, 0.7)',
    navBg:
      'linear-gradient(180deg, rgba(5, 6, 10, 0.92) 0%, rgba(5, 6, 10, 0.6) 60%, transparent 100%)',
    navBorder: 'rgba(255, 255, 255, 0.12)',
    footerBg: 'rgba(12, 15, 22, 0.75)',
    footerShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
    outlineStroke: '#ffffff',
    headingShadow: '0 2px 14px rgba(0, 0, 0, 0.8)',
    goldShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
    cursorOuter: 'rgba(217, 200, 169, 0.5)',
    cursorInner: 'rgba(217, 200, 169, 0.25)',
    isLight: false,
  },
  fonts: {
    display: "'Anton', Impact, sans-serif",
    body: "'Montserrat', system-ui, sans-serif",
  },
  breakpoints: {
    mobile: '800px',
  },
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    bg: '#f7f6f2',
    textPrimary: '#0f1115',
    textSecondary: '#475060',
    textMuted: '#64748b',
    gold: '#94763e',
    blue: '#94763e',
    white: '#ffffff',
    borderLight: 'rgba(0, 0, 0, 0.08)',
    borderMedium: 'rgba(0, 0, 0, 0.18)',
    cardBg: '#ffffff',
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    cardShadow: '0 12px 32px rgba(0, 0, 0, 0.06)',
    cardText: '#0f1115',
    swatchStageBg:
      'radial-gradient(circle at 50% 45%, #f1f3f6 0%, #dcdfe4 100%)',
    swatchBorder: 'rgba(0, 0, 0, 0.06)',
    btnPrimaryBg: '#0f1115',
    btnPrimaryText: '#ffffff',
    btnHoverBg: '#27272a',
    btnDisabledBg: 'rgba(0, 0, 0, 0.06)',
    btnShadow: '0 4px 16px rgba(15, 17, 21, 0.15)',
    sizeBtnBg: 'rgba(255, 255, 255, 0.85)',
    navBg:
      'linear-gradient(180deg, rgba(247, 246, 242, 0.95) 0%, rgba(247, 246, 242, 0.65) 60%, transparent 100%)',
    navBorder: 'rgba(0, 0, 0, 0.06)',
    footerBg: 'rgba(255, 255, 255, 0.8)',
    footerShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
    outlineStroke: '#0f1115',
    headingShadow: 'none',
    goldShadow: 'none',
    cursorOuter: 'rgba(15, 17, 21, 0.3)',
    cursorInner: 'rgba(15, 17, 21, 0.15)',
    isLight: true,
  },
  fonts: {
    display: "'Anton', Impact, sans-serif",
    body: "'Montserrat', system-ui, sans-serif",
  },
  breakpoints: {
    mobile: '800px',
  },
};

// Default backward compatibility
export const theme = darkTheme;
