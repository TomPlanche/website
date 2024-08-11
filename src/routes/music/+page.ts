import LastFMHandler from "$lib/LastFMMiddleware/LastFMHandler";
import { json } from "@sveltejs/kit";

export const load = async () => {
	const lastFMHandlerInstance = LastFMHandler.getInstance("tom_planche");

	const lovedTrack = await lastFMHandlerInstance.getUserLovedTracks(1);

	return {
		lovedTracks: lovedTrack,
	};
};
