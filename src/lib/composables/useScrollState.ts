import { scrollTrigger } from "$lib/components/header-footer/index";
import { onMount } from "svelte";

/**
 * Return type for the useScrollState composable
 */
interface UseScrollStateReturn {
  readonly isScrolled: boolean;
}

/**
 * A composable that tracks scroll state and determines if the page is scrolled beyond a trigger point.
 *
 * This composable provides reactive scroll state management using Svelte 5's runes system.
 * It tracks the current scroll position and whether scrolling is possible on the page,
 * then derives a boolean indicating if the scroll position has exceeded the defined trigger threshold.
 *
 * The composable automatically sets up and cleans up event listeners for:
 * - `scroll` events to track vertical scroll position
 * - `resize` events to recalculate scroll capabilities when window size changes
 *
 * @returns An object containing:
 * - `isScrolled`: A reactive derived value that returns `true` when either:
 *   - The page cannot be scrolled (content fits within viewport), OR
 *   - The current scroll position is greater than or equal to the `scrollTrigger` value
 *
 * @example
 * ```svelte
 * <script>
 *   import { useScrollState } from '$lib/composables/useScrollState';
 *
 *   const { isScrolled } = useScrollState();
 * </script>
 *
 * <header class:scrolled={isScrolled}>
 *   <!-- Header content that changes appearance when scrolled -->
 * </header>
 * ```
 */
export const useScrollState = (): UseScrollStateReturn => {
  let scrollY: number = $state(0);
  let canScroll: boolean = $state(false);
  const isScrolled: boolean = $derived(!canScroll || scrollY >= scrollTrigger);

  onMount(() => {
    const updateScrollY = (): void => {
      scrollY = window.scrollY;
    };

    const updateCanScroll = (): void => {
      canScroll = document.documentElement.scrollHeight > window.innerHeight;
    };

    const updateAll = (): void => {
      updateScrollY();
      updateCanScroll();
    };

    // Initial update
    updateAll();

    window.addEventListener("scroll", updateScrollY);
    window.addEventListener("resize", updateAll);

    return (): void => {
      window.removeEventListener("scroll", updateScrollY);
      window.removeEventListener("resize", updateAll);
    };
  });

  return {
    isScrolled,
  } as const;
};
