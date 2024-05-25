/**
 * Action to detect when an element is in view.
 * It will add a class to the element when it is in view and remove it when it is not.
 *
 * ## Usage
 * Let's say fou have a footer and you want to hide somethin when the footer is in view.
 * ````svelte
 * <footer
 *    use:inView={{inViewName: 'footer'}}
 * >...</footer>
 * ````
 *
 * And in the element you can listen to the event like this:
 * ```svelte
 *  <h1
 *    use:inView={{ inViewName: 'Footer', threshold: 0 }}
 *    on:inViewFooter={() => {
 *      ...
 *    }}
 *    on:outViewFooter={() => {
 *      ...
 *    }}
 *  >
 *    Title
 * </h1>
 *
 */
import type { Action } from 'svelte/action';

export const inView: Action<
  HTMLElement,
  | {
      inViewName: string;
      topOffset?: number;
      bottomOffset?: number;
      threshold?: number | number[];
    }
  | undefined
> = (
  node: HTMLElement,
  params = {
    inViewName: 'default'
  }
): { destroy(): void } => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log(entry);
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
