import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --bg: ${({ theme }) => theme.colors.bg};
    --text-primary: ${({ theme }) => theme.colors.textPrimary};
    --text-secondary: ${({ theme }) => theme.colors.textSecondary};
    --text-muted: ${({ theme }) => theme.colors.textMuted};
    --gold: ${({ theme }) => theme.colors.gold};
    --blue: ${({ theme }) => theme.colors.blue};
    --border-light: ${({ theme }) => theme.colors.borderLight};
    --border-medium: ${({ theme }) => theme.colors.borderMedium};
    --card-bg: ${({ theme }) => theme.colors.cardBg};
    --card-border: ${({ theme }) => theme.colors.cardBorder};
    --card-shadow: ${({ theme }) => theme.colors.cardShadow};
    --card-text: ${({ theme }) => theme.colors.cardText};
    --swatch-stage-bg: ${({ theme }) => theme.colors.swatchStageBg};
    --swatch-border: ${({ theme }) => theme.colors.swatchBorder};
    --btn-primary-bg: ${({ theme }) => theme.colors.btnPrimaryBg};
    --btn-primary-text: ${({ theme }) => theme.colors.btnPrimaryText};
    --btn-hover-bg: ${({ theme }) => theme.colors.btnHoverBg};
    --btn-disabled-bg: ${({ theme }) => theme.colors.btnDisabledBg};
    --btn-shadow: ${({ theme }) => theme.colors.btnShadow};
    --size-btn-bg: ${({ theme }) => theme.colors.sizeBtnBg};
    --nav-bg: ${({ theme }) => theme.colors.navBg};
    --nav-border: ${({ theme }) => theme.colors.navBorder};
    --footer-bg: ${({ theme }) => theme.colors.footerBg};
    --footer-shadow: ${({ theme }) => theme.colors.footerShadow};
    --outline-stroke: ${({ theme }) => theme.colors.outlineStroke};
    --heading-shadow: ${({ theme }) => theme.colors.headingShadow};
    --gold-shadow: ${({ theme }) => theme.colors.goldShadow};
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: var(--bg);
    color: var(--text-primary);
    font-family: 'Montserrat', system-ui, sans-serif;
    overflow-x: hidden;
    cursor: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background 0.3s ease, color 0.3s ease;
  }

  a, button {
    color: inherit;
    text-decoration: none;
    cursor: none;
    font-family: inherit;
  }

  #gl {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 0;
    pointer-events: none;
  }

  main {
    position: relative;
    z-index: 2;
  }

  section {
    min-height: 100vh;
    padding: 0 6vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }

  .d {
    font-family: 'Anton', Impact, sans-serif;
    font-weight: 400;
    text-transform: uppercase;
    line-height: 0.94;
    letter-spacing: 0.02em;
    font-size: clamp(3.4rem, 11vw, 10rem);
    color: var(--text-primary);
    text-shadow: var(--heading-shadow);
    transition: color 0.3s ease, text-shadow 0.3s ease;
  }

  .o {
    color: transparent;
    -webkit-text-stroke: 2px var(--outline-stroke);
    filter: ${({ theme }) =>
      theme.colors.isLight
        ? 'none'
        : 'drop-shadow(0 0 16px rgba(0, 0, 0, 0.95))'};
    transition:
      -webkit-text-stroke 0.3s ease,
      filter 0.3s ease;
  }

  p.l {
    max-width: 36ch;
    margin-top: 22px;
    font-size: clamp(0.95rem, 1.25vw, 1.15rem);
    line-height: 1.65;
    color: var(--text-secondary);
    font-weight: 400;
    text-shadow: var(--heading-shadow);
    transition: color 0.3s ease;

    b {
      color: var(--text-primary);
      font-weight: 600;
      transition: color 0.3s ease;
    }
  }

  .rv {
    opacity: 0;
    transform: translateY(30px);
    transition:
      opacity 0.8s ease-out,
      transform 0.8s ease-out;

    &.in {
      opacity: 1;
      transform: none;
    }
  }

  @media (max-width: 800px) {
    body, a, button {
      cursor: auto;
    }

    section {
      justify-content: flex-start;
      padding-top: 18vh;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .rv {
      transition: none;
      opacity: 1;
      transform: none;
    }
  }
`;
