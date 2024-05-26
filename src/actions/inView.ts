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
 * ## Parameters
 * - `inViewName`: The name of the inView action. It will be used to create the event names.
 * - `topOffset`: The top offset to trigger the inView event.
 * - `bottomOffset`: The bottom offset to trigger the inView event.
 * - `threshold`: The threshold to trigger the inView event.
 *   This can be a number or an array of numbers.
 *   Its
 */
import { capitalize } from '$lib/utils';
import type { Action } from 'svelte/action';

export const inView: Action<
  HTMLElement,
  {
    inViewName: string;
    topOffset?: number;
    bottomOffset?: number;
    threshold?: number | number[];
  } & (
    | { inCallback?: never; optionalThresholds?: never }
    | { inCallback: (visiblePct: number) => void; optionalThresholds: number[] }
  )
> = (
  node: HTMLElement,
  params = {
    inViewName: 'default',
    topOffset: 0,
    bottomOffset: 0,
    threshold: 0.1
  }
): { destroy(): void } => {
  const { inViewName, topOffset, bottomOffset, threshold, inCallback, optionalThresholds } = params;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (inCallback) {
          inCallback(entry.intersectionRatio);
        }

        if (entry.isIntersecting) {
          node.dispatchEvent(new CustomEvent(`inView${capitalize(inViewName)}`));
          if (
            inCallback &&
            !Array.isArray(entry.intersectionRatio) &&
            entry.intersectionRatio <= (threshold! as number)
          ) {
            node.dispatchEvent(new CustomEvent(`outView${capitalize(inViewName)}`));
          }
        } else {
          node.dispatchEvent(new CustomEvent(`outView${capitalize(inViewName)}`));
        }
      });
    },
    {
      threshold: inCallback ? optionalThresholds : threshold,
      rootMargin: `${topOffset || 0}px 0px ${bottomOffset || 0}px 0px`
    }
  );

  observer.observe(node as Element);

  return {
    destroy() {
      observer.disconnect();
    }
  };
};
