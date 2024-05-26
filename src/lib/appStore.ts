/**
 * @file src/lib/appStore.ts
 * @description appStore
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import { writable } from 'svelte/store';
import LastFMHandler, { type TRecentTracksTrackAll } from '$lib/LastFMHandler';
import { style_vars } from '$lib/globals';
import type { SvelteComponent } from 'svelte';
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLE
// Type(s)
export type TTHEME = 'dark' | 'light';

export type TState = {
  theme: TTHEME;
  lastFMHandlerInstance: LastFMHandler;
  paddingTopStart: string;
  paddingTopEnd: string;
  pageMinHeight: string;

  loadingAnimationIsDone: boolean;
  songCurrentlyPlaying?: TRecentTracksTrackAll | true;

  isFirstLoad: boolean;
  currentLink: LINKS;

  // refs
  cursor: SvelteComponent | null;

  toggleTheme: () => void;
  getTheme: () => TTHEME;
};

// Other(s)
export enum LINKS {
  HOME = 'home',
  ABOUT = 'about'
  // CONTACT = 'contact'
}

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
  lastFMHandlerInstance: LastFMHandler.getInstance('Tom_planche'),
  paddingTopStart: padding_top_start,
  paddingTopEnd: padding_top_end,
  pageMinHeight: page_size_with_padding,

  loadingAnimationIsDone: false,

  isFirstLoad: true,
  currentLink: LINKS.HOME,

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
