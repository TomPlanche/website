/**
 * @file src/lib/stores/mainStore.ts
 * @description mainStore
 * @author Tom Planche
 */

import { writable } from "svelte/store";

export type TState = {
  isMobileOrTablet?: boolean;
  clearPage?: boolean;
};

export const mainStore = writable<TState>({
  isMobileOrTablet: undefined,
  clearPage: false,
});

/**
 * End of file src/lib/stores/mainStore.ts
 */
