import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';
import LastFM_handler from '$lib/LastFM_handler';
import { style_vars } from '$lib/globals';

// Type(s)
export type T_THEME = 'dark' | 'light';

export type T_state = {
	theme: T_THEME;
	lastFMHandlerInstance: LastFM_handler;
	paddingTopStart: string;
	paddingTopEnd: string;
	pageMinHeight: string;

	// refs
	cursor: SvelteComponent | null;

	loadingAnimationIsDone: boolean;

	toggleTheme: () => void;
};

// Other(s)
const headerHeight = style_vars.header_height;
const padding = style_vars.main_padding;

const padding_top_start = `calc(2 * ${padding} + ${headerHeight})`;
const padding_top_end = `calc(${padding} + ${headerHeight})`;
const page_size_with_padding = `calc(100vh - (2 * ${padding} + ${headerHeight}))`;

export const store = writable<T_state>({
	theme: 'dark', // Set your default theme here,
	lastFMHandlerInstance: LastFM_handler.getInstance('Tom_planche'),
	paddingTopStart: padding_top_start,
	paddingTopEnd: padding_top_end,
	pageMinHeight: page_size_with_padding,

	loadingAnimationIsDone: false,

	toggleTheme() {
		console.log(`[appStore] toggleTheme() - this.theme: ${this.theme}`);
		this.theme = this.theme === 'dark' ? 'light' : 'dark';
		console.log(`[appStore] toggleTheme() - this.theme: ${this.theme}`);
	}
} as T_state);
