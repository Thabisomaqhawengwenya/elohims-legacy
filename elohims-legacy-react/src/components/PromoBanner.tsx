import React, { useState } from 'react';
import styled from 'styled-components';
import { StorePromotion } from '../data/content';

interface PromoBannerProps {
  promotion: StorePromotion;
  onAdminClick?: () => void;
  onMerchClick?: () => void;
}

const BannerContainer = styled.aside`
  position: relative;
  z-index: 25;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  padding: 8px 6vw;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  .banner-content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;

    span.sparkle {
      color: var(--gold);
    }

    span.code-badge {
      background: var(--bg);
      color: var(--text-primary);
      padding: 2px 8px;
      border-radius: 9999px;
      font-family: ${({ theme }) => theme.fonts.display};
      letter-spacing: 0.1em;
      font-size: 0.75rem;
      border: 1px solid var(--border-medium);
    }
  }

  button.close-btn {
    position: absolute;
    right: 20px;
    background: transparent;
    border: none;
    color: inherit;
    opacity: 0.7;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 4px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }

  @media (max-width: 600px) {
    padding: 8px 10px;
    font-size: 0.65rem;

    button.close-btn {
      position: static;
      margin-left: 6px;
    }
  }
`;

export const PromoBanner: React.FC<PromoBannerProps> = ({ promotion }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  if (!promotion.enabled || isDismissed) {
    return null;
  }

  return (
    <BannerContainer>
      <div className="banner-content">
        <span className="sparkle">✦</span>
        <span>{promotion.bannerText}</span>
        {promotion.code && (
          <span className="code-badge">CODE: {promotion.code}</span>
        )}
        <span className="sparkle">✦</span>
      </div>
      <button
        type="button"
        className="close-btn"
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss banner"
      >
        ✕
      </button>
    </BannerContainer>
  );
};
