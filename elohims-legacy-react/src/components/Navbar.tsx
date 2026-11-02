import React from 'react';
import styled from 'styled-components';

interface NavbarProps {
  brandName: string;
  cartCount: number;
  onCartClick: () => void;
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
  background: linear-gradient(
    180deg,
    rgba(5, 6, 10, 0.92) 0%,
    rgba(5, 6, 10, 0.6) 60%,
    transparent 100%
  );
  backdrop-filter: blur(8px);

  b {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 400;
    letter-spacing: 0.12em;
    font-size: 1.15rem;
    color: #ffffff;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
  }

  div {
    display: flex;
    gap: 28px;
    align-items: center;

    a {
      font-weight: 600;
      letter-spacing: 0.04em;
      color: #ffffff;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
      transition: color 0.2s;

      &:hover {
        color: ${({ theme }) => theme.colors.gold};
      }
    }
  }

  #cart {
    border: 1.5px solid rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border-radius: 30px;
    padding: 8px 20px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    transition:
      background 0.2s,
      color 0.2s,
      transform 0.2s,
      box-shadow 0.2s;

    &:hover {
      background: #ffffff;
      color: #000000;
      transform: scale(1.04);
      box-shadow: 0 0 16px rgba(255, 255, 255, 0.4);
    }
  }
`;

export const Navbar: React.FC<NavbarProps> = ({
  brandName,
  cartCount,
  onCartClick,
}) => {
  return (
    <Nav>
      <b>{brandName}</b>
      <div>
        <a href="#shop">Shop</a>
        <a href="#contact">Contact</a>
        <button id="cart" onClick={onCartClick} type="button">
          Cart ({cartCount})
        </button>
      </div>
    </Nav>
  );
};
