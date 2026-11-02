import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --bg: #05060a;
    --blue: #d9c8a9;
    --gold: #d9c8a9;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: var(--bg);
    color: #ffffff;
    font-family: 'Montserrat', system-ui, sans-serif;
    overflow-x: hidden;
    cursor: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
    text-shadow:
      0 4px 24px rgba(0, 0, 0, 0.95),
      0 2px 8px rgba(0, 0, 0, 0.9);
  }

  .o {
    color: transparent;
    -webkit-text-stroke: 2px #ffffff;
    filter: drop-shadow(0 0 16px rgba(0, 0, 0, 0.95));
  }

  p.l {
    max-width: 36ch;
    margin-top: 22px;
    font-size: clamp(0.95rem, 1.25vw, 1.15rem);
    line-height: 1.65;
    color: #e2e8f0;
    font-weight: 400;
    text-shadow:
      0 2px 14px rgba(0, 0, 0, 0.95),
      0 1px 4px rgba(0, 0, 0, 0.9);

    b {
      color: #ffffff;
      font-weight: 600;
    }
  }

  .rv {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;

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
