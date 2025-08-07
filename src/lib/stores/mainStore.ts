/**
 * @file src/lib/stores/mainStore.ts
 * @description mainStore
 * @author Tom Planche
 */

import { writable } from "svelte/store";

export type TState = {
  isMobileOrTablet?: boolean;
  clearPage?: boolean;
  hideBackground?: boolean;
};

export const mainStore = writable<TState>({
  isMobileOrTablet: undefined,
  clearPage: false,
  hideBackground: false,
});

/**
 * End of file src/lib/stores/mainStore.ts
 */
