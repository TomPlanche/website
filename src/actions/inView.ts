import type { Action } from 'svelte/action';

/**
 * Action to detect when an element is in view.
 * It will add a class to the element when it is in view and remove it when it is not.
 *
 */
export const inView: Action<
  HTMLDivElement,
  | {
      inViewName: string;
      topOffset?: number;
      bottomOffset?: number;
      threshold?: number | number[];
    }
  | undefined
> = (
  node: Element,
  params = {
    inViewName: 'default'
  }
): { destroy(): void } => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.dispatchEvent(new CustomEvent(`inView${params.inViewName}`));
        } else {
          node.dispatchEvent(new CustomEvent(`outView${params.inViewName}`));
        }
      });
    },
    {
      threshold: params.threshold || 0.1,
      rootMargin: `${params.topOffset || 0}px 0px ${params.bottomOffset || 0}px 0px`
    }
  );

  observer.observe(node as Element);

  return {
    destroy() {
      observer.disconnect();
    }
  };
};
