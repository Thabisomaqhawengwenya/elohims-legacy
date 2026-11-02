import { useEffect, useRef, useState } from 'react';

export function useScrollProgress() {
  const scrollRef = useRef<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', onMotionChange);

    const onScroll = () => {
      scrollRef.current = window.scrollY / Math.max(1, window.innerHeight);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      mediaQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return {
    scrollRef,
    prefersReducedMotion,
  };
}
