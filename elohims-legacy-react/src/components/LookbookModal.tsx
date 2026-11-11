import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import frontImgUrl from '../assets/front.webp';
import backImgUrl from '../assets/back.webp';
import tee2FrontUrl from '../assets/tee2-front.jpg';
import tee2BackUrl from '../assets/tee2-back.jpg';
import { Product } from '../data/content';

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'front' | 'back';
  product?: Product | null;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleUp = keyframes`
  from { transform: scale(0.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1100;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 860px;
  background: var(--card-bg);
  border: 1px solid var(--border-medium);
  border-radius: 24px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  color: var(--text-primary);
  animation: ${scaleUp} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 92vh;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-light);

  .tag-group {
    display: flex;
    align-items: baseline;
    gap: 10px;

    h3 {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.15rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0;
      color: var(--text-primary);
    }

    span.badge {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--gold);
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      padding: 2px 8px;
      border-radius: 9999px;
    }
  }

  button.close-btn {
    background: transparent;
    border: 1px solid var(--border-medium);
    color: var(--text-muted);
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: var(--text-primary);
      border-color: var(--text-primary);
      transform: rotate(90deg);
    }
  }
`;

const ViewerStage = styled.div<{ $isZoomed: boolean }>`
  position: relative;
  width: 100%;
  height: 480px;
  background: radial-gradient(circle at 50% 50%, #d8dade 0%, #b8bcc3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: ${({ $isZoomed }) => ($isZoomed ? 'zoom-out' : 'zoom-in')};
  transition: background 0.3s ease;

  img {
    max-height: 85%;
    max-width: 85%;
    object-fit: contain;
    filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.45));
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    transform: ${({ $isZoomed }) => ($isZoomed ? 'scale(1.85)' : 'scale(1)')};
    user-select: none;
  }

  .zoom-hint {
    position: absolute;
    bottom: 16px;
    left: 20px;
    background: rgba(12, 13, 18, 0.75);
    backdrop-filter: blur(8px);
    color: #ffffff;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    padding: 6px 14px;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    pointer-events: none;
  }
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-light);
  gap: 12px;
  flex-wrap: wrap;

  .view-pills {
    display: flex;
    background: var(--card-bg);
    border: 1px solid var(--border-medium);
    border-radius: 9999px;
    padding: 3px;
    gap: 4px;

    button {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 6px 14px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        background: var(--text-primary);
        color: var(--bg);
      }
    }
  }

  .zoom-pills {
    display: flex;
    gap: 8px;
    align-items: center;

    span.lbl {
      font-size: 0.72rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    button.zoom-toggle {
      background: var(--card-bg);
      border: 1px solid var(--border-medium);
      color: var(--text-primary);
      padding: 6px 14px;
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        border-color: var(--gold);
        color: var(--gold);
      }
    }
  }
`;

const SpecsFooter = styled.div`
  padding: 16px 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  border-top: 1px solid var(--border-light);

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  .spec-item {
    display: flex;
    flex-direction: column;
    gap: 3px;

    span.prop {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }

    span.val {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.85rem;
      color: var(--text-primary);
    }
  }
`;

export const LookbookModal: React.FC<LookbookModalProps> = ({
  isOpen,
  onClose,
  initialView = 'front',
  product,
}) => {
  const [activeView, setActiveView] = useState<'front' | 'back'>(initialView);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const isTee2 =
    product?.id === 'lord-i-cant-tee' ||
    product?.frontImage === 'tee2-front' ||
    Boolean(product?.name.toLowerCase().includes('lord') || product?.name.toLowerCase().includes("can't"));

  const frontSrc = isTee2 ? tee2FrontUrl : frontImgUrl;
  const backSrc = isTee2 ? tee2BackUrl : backImgUrl;
  const displayName = product?.name || 'Directed by Elohim Tee';

  useEffect(() => {
    setActiveView(initialView);
    setIsZoomed(false);
  }, [initialView, isOpen, product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <ModalOverlay
      $isOpen={isOpen}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div className="tag-group">
            <h3>{displayName}</h3>
            <span className="badge">
              {activeView === 'front'
                ? 'Chest Print Detail'
                : isTee2
                  ? 'Collage & Scripture Badges'
                  : "Back Lord's Prayer"}
            </span>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close lookbook"
          >
            ✕
          </button>
        </ModalHeader>

        <ViewerStage
          $isZoomed={isZoomed}
          onClick={() => setIsZoomed((prev) => !prev)}
        >
          <img
            src={activeView === 'front' ? frontSrc : backSrc}
            alt={`Macro inspection of ${displayName} ${activeView} print`}
          />
          <div className="zoom-hint">
            {isZoomed ? 'Click anywhere to zoom out' : 'Click garment to inspect print details (185%)'}
          </div>
        </ViewerStage>

        <ControlsBar>
          <div className="view-pills">
            <button
              type="button"
              className={activeView === 'front' ? 'active' : ''}
              onClick={() => {
                setActiveView('front');
                setIsZoomed(false);
              }}
            >
              Front Print
            </button>
            <button
              type="button"
              className={activeView === 'back' ? 'active' : ''}
              onClick={() => {
                setActiveView('back');
                setIsZoomed(false);
              }}
            >
              {isTee2 ? "Back ('Lord, I Can't')" : 'Back Prayer (Matt 6:9–13)'}
            </button>
          </div>

          <div className="zoom-pills">
            <span className="lbl">Zoom</span>
            <button
              type="button"
              className={`zoom-toggle ${!isZoomed ? 'active' : ''}`}
              onClick={() => setIsZoomed(false)}
            >
              100% Fit
            </button>
            <button
              type="button"
              className={`zoom-toggle ${isZoomed ? 'active' : ''}`}
              onClick={() => setIsZoomed(true)}
            >
              185% Macro
            </button>
          </div>
        </ControlsBar>

        <SpecsFooter>
          <div className="spec-item">
            <span className="prop">Fabric Quality</span>
            <span className="val">280 GSM Heavyweight Cotton</span>
          </div>
          <div className="spec-item">
            <span className="prop">Print Technology</span>
            <span className="val">
              {isTee2
                ? 'High-Density Screenprint & Cutout Texture'
                : 'High-Density Soft Plastisol Ink'}
            </span>
          </div>
          <div className="spec-item">
            <span className="prop">{isTee2 ? 'Scripture Seals' : 'Collar & Seams'}</span>
            <span className="val">
              {isTee2
                ? '2 Cor 12:9 · Isa 40:29 · Matt 19:26 · Phil 4:13 · Ex 14:14'
                : 'Reinforced 1.25" Ribbed Crewneck'}
            </span>
          </div>
        </SpecsFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};
