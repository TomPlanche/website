/**
 * @file src/lib/appStore.ts
 * @description appStore
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import { writable } from 'svelte/store';
import LastFM_handler from '$lib/LastFM_handler';
import { style_vars } from '$lib/globals';
import type { SvelteComponent } from 'svelte';
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLE
// Type(s)
export type TTHEME = 'dark' | 'light';
export type TState = {
  theme: TTHEME;
  lastFMHandlerInstance: LastFM_handler;
  paddingTopStart: string;
  paddingTopEnd: string;
  pageMinHeight: string;

  loadingAnimationIsDone: boolean;
  hideIsPlaying: boolean;

  // refs
  cursor: SvelteComponent | null;

  toggleTheme: () => void;
  getTheme: () => TTHEME;
};

// Other(s)
const headerHeight = style_vars.header_height;
const padding = style_vars.main_padding;

const padding_top_start = `calc(2 * ${padding} + ${headerHeight})`;
const padding_top_end = `calc(${padding} + ${headerHeight})`;
const page_size_with_padding = `calc(100vh - (2 * ${padding} + ${headerHeight}))`;
// END VARIABLES ======================================================================================= END VARIABLES

// FUNCTIONS ================================================================================================ FUNCTIONS

// END FUNCTIONS ======================================================================================== END FUNCTIONS

// CODE ========================================================================================================= CODE
export const store = writable<TState>({
  theme: 'dark', // Set your default theme here,
  lastFMHandlerInstance: LastFM_handler.getInstance('Tom_planche'),
  paddingTopStart: padding_top_start,
  paddingTopEnd: padding_top_end,
  pageMinHeight: page_size_with_padding,

  loadingAnimationIsDone: false,
  hideIsPlaying: false,

  toggleTheme() {
    console.log(`[appStore] toggleTheme() - this.theme: ${this.theme}`);
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    console.log(`[appStore] toggleTheme() - this.theme: ${this.theme}`);
  }
} as TState);
// END CODE =======================================================================================  END COMPONENT

/**
 * End of file src/appStore.ts
 */
