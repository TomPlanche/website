import type { Sticker } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  try {
    const response = await fetch("/api-front/map");

    if (!response.ok) {
      throw new Error(`Failed to fetch stickers: ${response.statusText}`);
    }

    const stickers: Sticker[] = await response.json();

    return {
      stickers,
    };
  } catch (error) {
    console.error("Error fetching stickers:", error);
    return {
      stickers: [],
    };
  }
};
