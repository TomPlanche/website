import { error, json, type RequestHandler } from "@sveltejs/kit";
import { getAllStickers } from "$lib/utils/stickers";

export const GET: RequestHandler = async () => {
  try {
    const stickers = await getAllStickers();

    return json(stickers);
  } catch (e: unknown) {
    console.error("Error fetching recent tracks:", e);

    return error(500, <App.Error>e);
  }
};
