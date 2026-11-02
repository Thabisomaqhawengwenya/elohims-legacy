import React from 'react';
import styled from 'styled-components';

interface NavbarProps {
  brandName: string;
  cartCount: number;
  onCartClick: () => void;
  isLight: boolean;
  onToggleTheme: () => void;
}

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 6vw;
  font-size: 0.85rem;
  background: var(--nav-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.3s ease;

  b {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 400;
    letter-spacing: 0.12em;
    font-size: 1.15rem;
    color: var(--text-primary);
    text-shadow: var(--heading-shadow);
    transition: color 0.3s ease;
  }

  div.nav-actions {
    display: flex;
    gap: 20px;
    align-items: center;

    a {
      font-weight: 600;
      letter-spacing: 0.04em;
      color: var(--text-primary);
      text-shadow: var(--heading-shadow);
      transition: color 0.2s;

      &:hover {
        color: var(--gold);
      }
    }
  }

  #cart {
    border: 1.5px solid var(--border-medium);
    background: var(--size-btn-bg);
    backdrop-filter: blur(8px);
    border-radius: 30px;
    padding: 8px 18px;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition:
      background 0.2s,
      color 0.2s,
      transform 0.2s,
      border-color 0.2s;

    &:hover {
      background: var(--text-primary);
      color: var(--bg);
      border-color: var(--text-primary);
      transform: scale(1.04);
    }
  }

  @media (max-width: 600px) {
    padding: 16px 5vw;
    div.nav-actions {
      gap: 12px;
    }
    div.nav-actions a {
      display: none;
    }
  }
`;

const ThemeToggleBtn = styled.button`
  border: 1.5px solid var(--border-medium);
  background: var(--size-btn-bg);
  backdrop-filter: blur(8px);
  border-radius: 30px;
  padding: 7px 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-primary);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    background 0.2s,
    color 0.2s,
    transform 0.2s,
    border-color 0.2s;

  svg {
    stroke: currentColor;
    flex-shrink: 0;
  }

  &:hover {
    border-color: var(--text-primary);
    transform: scale(1.04);
  }
`;

export const Navbar: React.FC<NavbarProps> = ({
  brandName,
  cartCount,
  onCartClick,
  isLight,
  onToggleTheme,
}) => {
  return (
    <Nav>
      <b>{brandName}</b>
      <div className="nav-actions">
        <a href="#shop">Shop</a>
        <a href="#contact">Contact</a>
        <ThemeToggleBtn
          onClick={onToggleTheme}
          type="button"
          title={isLight ? 'Switch to Dark theme' : 'Switch to Light theme'}
          aria-label="Toggle dark/light theme"
        >
          {isLight ? (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span>Dark</span>
            </>
          ) : (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <span>Light</span>
            </>
          )}
        </ThemeToggleBtn>
        <button id="cart" onClick={onCartClick} type="button">
          Cart ({cartCount})
        </button>
      </div>
    </Nav>
  );
};
