/**
 * Main store for the application.
 */

import type Cursor from "$lib/components/Cursor.svelte";
import { writable } from "svelte/store";

type TLink = {
	title: string;
	href: string;
	description: string;
};

export const LINKS: TLink[] = [
	{
		title: "Home",
		href: "/",
		description: "Home page",
	},
	{
		title: "About",
		href: "/about",
		description: "More about me",
	},
	{
		title: "Music",
		href: "/music",
		description: "What I'm listening to",
	},
] as const;

export type TMainStore = {
	loadingAnimationIsDone: boolean;
	currentLink: (typeof LINKS)[number];

	cursor: Cursor | null;
	hideCursor: boolean;

	musicPlayingYDistance: number;
};

const mainStoreDefault: TMainStore = {
	loadingAnimationIsDone: false,
	currentLink: LINKS[0],

	cursor: null,
	hideCursor: false,

	musicPlayingYDistance: 0,
};

export const mainStore = writable<TMainStore>(mainStoreDefault);
