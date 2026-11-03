import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

interface WaitlistEntry {
  product: string;
  whatsapp: string;
  email?: string;
  size: string;
  timestamp: string;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleUp = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1100;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: var(--card-bg);
  border: 1px solid var(--border-medium);
  border-radius: 22px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55);
  color: var(--text-primary);
  animation: ${scaleUp} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);

  .headline-group {
    h3 {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.15rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0;
      color: var(--text-primary);
    }
    span.capsule {
      font-size: 0.72rem;
      color: var(--gold);
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
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

const Body = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  p.intro {
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.5;
    margin: 0;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    input {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-medium);
      border-radius: 12px;
      padding: 12px 14px;
      color: var(--text-primary);
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;

      &:focus {
        border-color: var(--gold);
      }

      &::placeholder {
        color: var(--text-muted);
        opacity: 0.6;
      }
    }
  }

  .size-picker {
    display: flex;
    gap: 8px;

    button.size-pill {
      flex: 1;
      height: 38px;
      border-radius: 8px;
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      color: var(--text-primary);
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        background: var(--text-primary);
        color: var(--bg);
        border-color: var(--text-primary);
      }

      &:hover:not(.active) {
        border-color: var(--text-primary);
      }
    }
  }

  button.submit-btn {
    margin-top: 8px;
    height: 48px;
    border-radius: 9999px;
    border: none;
    background: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    font-weight: 700;
    font-size: 0.88rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: var(--btn-shadow);
    transition: all 0.2s;

    &:hover {
      background: var(--btn-hover-bg);
      transform: scale(1.02);
    }
  }
`;

const SuccessState = styled.div`
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;

  .check-icon {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: rgba(37, 211, 102, 0.15);
    border: 2px solid #25d366;
    color: #25d366;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
  }

  h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.2rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 0;
    color: var(--text-primary);
  }

  p {
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.5;
    max-width: 320px;
    margin: 0;
  }

  button.done-btn {
    margin-top: 10px;
    padding: 10px 28px;
    border-radius: 9999px;
    border: 1px solid var(--border-medium);
    background: transparent;
    color: var(--text-primary);
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--text-primary);
      color: var(--bg);
    }
  }
`;

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  productName,
}) => {
  const [whatsapp, setWhatsapp] = useState<string>('+263 ');
  const [email, setEmail] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setWhatsapp('+263 ');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp || whatsapp.trim().length < 8) {
      alert('Please enter a valid WhatsApp number');
      return;
    }

    const newEntry: WaitlistEntry = {
      product: productName,
      whatsapp: whatsapp.trim(),
      email: email.trim() || undefined,
      size: selectedSize,
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem('elohims_drop_waitlist');
      const list: WaitlistEntry[] = existing ? JSON.parse(existing) : [];
      list.push(newEntry);
      localStorage.setItem('elohims_drop_waitlist', JSON.stringify(list));
    } catch (err) {
      console.error('Failed to store waitlist registration', err);
    }

    setIsSubmitted(true);
  };

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <ModalOverlay
      $isOpen={isOpen}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <div className="headline-group">
            <h3>VIP Drop Access</h3>
            <span className="capsule">{productName}</span>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close waitlist modal"
          >
            ✕
          </button>
        </Header>

        {isSubmitted ? (
          <SuccessState>
            <div className="check-icon">✓</div>
            <h4>You're on the VIP list</h4>
            <p>
              We have reserved your early drop access for{' '}
              <b>{productName}</b> (Size: {selectedSize}). You will receive direct
              notification on WhatsApp 1 hour before public release.
            </p>
            <button
              type="button"
              className="done-btn"
              onClick={onClose}
            >
              Done
            </button>
          </SuccessState>
        ) : (
          <Body>
            <p className="intro">
              Capsule drop quantities are strictly limited. Register your WhatsApp
              number for priority early access and exclusive Zimbabwe drop pricing.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label>WhatsApp Number (Zimbabwe)</label>
                <input
                  type="tel"
                  placeholder="+263 7X XXX XXXX"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label>Email (Optional for drop lookbook)</label>
                <input
                  type="email"
                  placeholder="your.name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Anticipated Size</label>
                <div className="size-picker">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`size-pill ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Join Private Drop List
              </button>
            </form>
          </Body>
        )}
      </ModalCard>
    </ModalOverlay>
  );
};
