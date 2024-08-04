/**
 * Store for LastFM data
 */

import LastFMHandler from "$lib/LastFMMiddleware/LastFMHandler";
import { writable } from "svelte/store";

export type TLastFMStore = {
	instance: LastFMHandler;
};

export const lastFMStore = writable<TLastFMStore>({
	instance: LastFMHandler.getInstance("tom_planche"),
});
