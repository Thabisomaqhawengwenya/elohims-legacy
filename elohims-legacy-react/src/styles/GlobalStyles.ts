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
    z-index: 1;
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
    line-height: 0.92;
    font-size: clamp(3.4rem, 11vw, 10rem);
  }

  .o {
    color: transparent;
    -webkit-text-stroke: 1.5px #ffffff;
  }

  p.l {
    max-width: 34ch;
    margin-top: 22px;
    font-size: clamp(0.9rem, 1.2vw, 1.05rem);
    line-height: 1.6;
    color: #c9d0e0;

    b {
      color: #ffffff;
    }
  }

  .rv {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.9s, transform 0.9s;

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
    }
  }
`;
