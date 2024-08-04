/**
 * Main store for the application.
 */

import { writable } from "svelte/store";

export enum LINKS {
	HOME = "home",
	ABOUT = "about",
}

export type TMainStore = {
	loadingAnimationIsDone: boolean;
	currentLink: LINKS;
};

const mainStoreDefault: TMainStore = {
	loadingAnimationIsDone: false,
	currentLink: LINKS.HOME,
};

export const mainStore = writable<TMainStore>(mainStoreDefault);
