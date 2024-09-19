import LastFMHandler from "$lib/LastFMMiddleware/LastFMHandler";

export const load = async () => {
	const lastFMHandlerInstance = LastFMHandler.getInstance("tom_planche");

	const lovedTrack = await lastFMHandlerInstance.getUserLovedTracks(1);

	return {
		lovedTracks: lovedTrack,
	};
};
