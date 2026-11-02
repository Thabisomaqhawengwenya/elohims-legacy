import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface LoaderProps {
  isReady: boolean;
}

const LoadOverlay = styled.div<{ $fading: boolean }>`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.bg};
  color: #ffffff;
  z-index: 200;
  display: grid;
  place-items: center;
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.2em;
  transition: opacity 0.8s;
  opacity: ${({ $fading }) => ($fading ? 0 : 1)};
  pointer-events: ${({ $fading }) => ($fading ? 'none' : 'auto')};
`;

export const Loader: React.FC<LoaderProps> = ({ isReady }) => {
  const [visible, setVisible] = useState<boolean>(true);
  const [fading, setFading] = useState<boolean>(false);

  useEffect(() => {
    if (isReady) {
      setFading(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  if (!visible) return null;

  return (
    <LoadOverlay id="load" $fading={fading}>
      LOADING
    </LoadOverlay>
  );
};
