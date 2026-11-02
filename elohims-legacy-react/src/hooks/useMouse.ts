import { useEffect, useRef, useState } from 'react';

export interface MouseState {
  x: number;
  y: number;
  moved: boolean;
  fine: boolean;
}

export function useMouse() {
  const mouseRef = useRef<MouseState>({
    x: 0,
    y: 0,
    moved: false,
    fine: false,
  });

  const [hasFinePointer, setHasFinePointer] = useState<boolean>(false);

  useEffect(() => {
    const fineQuery = window.matchMedia('(pointer: fine)');
    const updatePointer = () => {
      mouseRef.current.fine = fineQuery.matches;
      setHasFinePointer(fineQuery.matches);
    };

    updatePointer();
    fineQuery.addEventListener('change', updatePointer);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moved = true;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      fineQuery.removeEventListener('change', updatePointer);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return {
    mouseRef,
    hasFinePointer,
  };
}
