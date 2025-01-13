/**
 * @file src/lib/stores/mainStore.ts
 * @description mainStore
 * @author Tom Planche
 */

import { writable } from "svelte/store";

export type TState = {
  isMobileOrTablet?: boolean;
};

export const mainStore = writable<TState>({
  isMobileOrTablet: undefined,
});

/**
 * End of file src/lib/stores/mainStore.ts
 */
