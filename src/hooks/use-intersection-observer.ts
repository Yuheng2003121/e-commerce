// hooks/use-intersection-observer.ts
import { useEffect, useRef, type RefObject } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
) {
  const { freezeOnceVisible = false, ...observerOptions } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callbackRef.current();
            if (freezeOnceVisible) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1, ...observerOptions }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [
    observerOptions.root,
    observerOptions.rootMargin,
    observerOptions.threshold,
    freezeOnceVisible,
    observerOptions
  ]);

  return elementRef;
}
