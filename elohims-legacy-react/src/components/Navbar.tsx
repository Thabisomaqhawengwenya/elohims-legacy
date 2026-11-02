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
  font-size: 0.8rem;

  b {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 400;
    letter-spacing: 0.12em;
    font-size: 1.1rem;
  }

  div {
    display: flex;
    gap: 28px;
    align-items: center;
  }

  #cart {
    border: 1px solid #ffffff;
    background: none;
    border-radius: 30px;
    padding: 8px 18px;
    font-size: 0.8rem;
    transition: background 0.2s, color 0.2s;

    &:hover {
      background: #ffffff;
      color: #000000;
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
