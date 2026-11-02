import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface CursorProps {
  hasFinePointer: boolean;
}

const CursorElement = styled.div<{ $visible: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border-radius: 50%;
  background: var(--text-primary);
  box-shadow:
    0 0 0 6px ${({ theme }) => theme.colors.cursorInner},
    0 0 24px 6px ${({ theme }) => theme.colors.cursorOuter};
  z-index: 99;
  pointer-events: none;
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  will-change: transform;
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;

  @media (max-width: 800px) {
    display: none;
  }
`;

export const Cursor: React.FC<CursorProps> = ({ hasFinePointer }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ mx: 0, my: 0, cx: 0, cy: 0, moved: false });

  useEffect(() => {
    if (!hasFinePointer) return;

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.mx = e.clientX;
      posRef.current.my = e.clientY;
      posRef.current.moved = true;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let rafId: number;
    const updateCursor = () => {
      const p = posRef.current;
      p.cx += (p.mx - p.cx) * 0.2;
      p.cy += (p.my - p.cy) * 0.2;

      if (cursorRef.current && p.moved) {
        cursorRef.current.style.transform = `translate3d(${p.cx}px, ${p.cy}px, 0)`;
      }

      rafId = requestAnimationFrame(updateCursor);
    };

    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [hasFinePointer]);

  if (!hasFinePointer) return null;

  return <CursorElement ref={cursorRef} id="cur" $visible={true} />;
};
