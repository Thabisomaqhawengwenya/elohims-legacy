import { useEffect } from 'react';

/**
 * Attaches an IntersectionObserver to elements with the '.rv' class,
 * adding the '.in' class when they scroll into view (threshold 0.2).
 */
export function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll('.rv');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);
}
