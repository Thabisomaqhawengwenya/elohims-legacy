import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  background: rgba(0, 0, 0, 0.7);
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
  max-width: 600px;
  background: var(--card-bg);
  border: 1px solid var(--border-medium);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  color: var(--text-primary);
  animation: ${scaleUp} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);

  .title-area {
    h3 {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.25rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0;
      color: var(--text-primary);
    }
    p {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin: 4px 0 0;
      letter-spacing: 0.04em;
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

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-medium);
    border-radius: 4px;
  }
`;

const UnitSwitcher = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span.fit-badge {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--gold);
    background: var(--bg-surface);
    border: 1px solid var(--border-medium);
    padding: 4px 12px;
    border-radius: 9999px;
  }

  .toggle-pills {
    display: flex;
    background: var(--bg-surface);
    border: 1px solid var(--border-medium);
    border-radius: 9999px;
    padding: 2px;

    button {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 4px 12px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        background: var(--text-primary);
        color: var(--bg);
      }
    }
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border-light);
  border-radius: 12px;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
    text-align: left;

    th {
      background: var(--bg-surface);
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.78rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-light);
      color: var(--text-muted);
    }

    td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-light);
      color: var(--text-primary);

      &.size-cell {
        font-family: ${({ theme }) => theme.fonts.display};
        font-weight: 700;
        color: var(--gold);
      }
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: var(--bg-surface);
    }
  }
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }

  .note-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-light);
    border-radius: 12px;
    padding: 14px;

    h5 {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.82rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin: 0 0 6px;
      color: var(--text-primary);
    }

    p {
      font-size: 0.74rem;
      color: var(--text-muted);
      line-height: 1.45;
      margin: 0;
    }
  }
`;

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const measurements = [
    {
      size: 'S',
      chestIn: '22.0"',
      chestCm: '56 cm',
      lengthIn: '28.0"',
      lengthCm: '71 cm',
      shoulderIn: '21.5"',
      shoulderCm: '55 cm',
      fits: "5'4\" – 5'8\" (162–173 cm)",
    },
    {
      size: 'M',
      chestIn: '23.0"',
      chestCm: '58.5 cm',
      lengthIn: '29.0"',
      lengthCm: '74 cm',
      shoulderIn: '22.5"',
      shoulderCm: '57 cm',
      fits: "5'8\" – 6'0\" (173–183 cm)",
    },
    {
      size: 'L',
      chestIn: '24.0"',
      chestCm: '61 cm',
      lengthIn: '30.0"',
      lengthCm: '76 cm',
      shoulderIn: '23.5"',
      shoulderCm: '60 cm',
      fits: "6'0\" – 6'2\" (183–188 cm)",
    },
    {
      size: 'XL',
      chestIn: '25.0"',
      chestCm: '63.5 cm',
      lengthIn: '31.0"',
      lengthCm: '79 cm',
      shoulderIn: '24.5"',
      shoulderCm: '62 cm',
      fits: "6'2\"+ (188+ cm)",
    },
  ];

  return (
    <ModalOverlay
      $isOpen={isOpen}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div className="title-area">
            <h3>Size & Fit Guide</h3>
            <p>Directed by Elohim Tee · Oversized Boxy Cut</p>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close size guide"
          >
            ✕
          </button>
        </ModalHeader>

        <ModalBody>
          <UnitSwitcher>
            <span className="fit-badge">Drop Shoulder · 280 GSM</span>
            <div className="toggle-pills">
              <button
                type="button"
                className={unit === 'in' ? 'active' : ''}
                onClick={() => setUnit('in')}
              >
                Inches (")
              </button>
              <button
                type="button"
                className={unit === 'cm' ? 'active' : ''}
                onClick={() => setUnit('cm')}
              >
                Centimeters (cm)
              </button>
            </div>
          </UnitSwitcher>

          <TableWrapper>
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (Width)</th>
                  <th>Length</th>
                  <th>Shoulder Drop</th>
                  <th>Recommended Frame</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((row) => (
                  <tr key={row.size}>
                    <td className="size-cell">{row.size}</td>
                    <td>{unit === 'in' ? row.chestIn : row.chestCm}</td>
                    <td>{unit === 'in' ? row.lengthIn : row.lengthCm}</td>
                    <td>{unit === 'in' ? row.shoulderIn : row.shoulderCm}</td>
                    <td>{row.fits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>

          <NotesGrid>
            <div className="note-card">
              <h5>The Streetwear Fit</h5>
              <p>
                Our signature boxy cut gives dropped shoulders with generous
                body drape. For the intended streetwear look, stay true to
                size. For a standard fit, size down one step.
              </p>
            </div>
            <div className="note-card">
              <h5>Fabric & Care</h5>
              <p>
                280 GSM 100% pre-shrunk combed cotton. Machine wash cold inside
                out with like colors. Hang dry to preserve the high-density
                white ink scripture print.
              </p>
            </div>
          </NotesGrid>
        </ModalBody>
      </ModalCard>
    </ModalOverlay>
  );
};
