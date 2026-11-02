import { useEffect } from 'react';

/**
 * Attaches an IntersectionObserver to elements with the '.rv' class,
 * adding the '.in' class when they scroll into view.
 * Elements already in the initial viewport are immediately revealed.
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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.rv');
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in');
      }
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
}
