/**
 * Main store for the application.
 */

import type Cursor from "$lib/components/Cursor.svelte";
import { writable } from "svelte/store";

export enum LINKS {
	HOME = "home",
	ABOUT = "about",
	MUSIC = "music",
}

export type TMainStore = {
	loadingAnimationIsDone: boolean;
	currentLink: LINKS;
	cursor: Cursor | null;
	musicPlayingYDistance: number;
};

const mainStoreDefault: TMainStore = {
	loadingAnimationIsDone: false,
	currentLink: LINKS.HOME,
	cursor: null,
	musicPlayingYDistance: 0,
};

export const mainStore = writable<TMainStore>(mainStoreDefault);
