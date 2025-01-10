/**
 * @file src/lib/stores/mainStore.ts
 * @description mainStore
 * @author Tom Planche
 */

import type { SvelteComponent } from "svelte";
import { writable } from "svelte/store";

export type TState = {
  // refs
  cursor: SvelteComponent | null;
};

export const refStore = writable<TState>({
  cursor: null,
});

/**
 * End of file src/lib/stores/mainStore.ts
 */
