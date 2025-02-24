/**
 * @file src/lib/types/songs.ts
 * @description songs
 * @author Tom Planche
 */
import {z} from "zod";

export const CurrentlyPlayedSong = z.object({
  name: z.string(),
  play_count: z.number(),
  artist: z.string(),
  album: z.string(),
  image_url: z.string()
});

export type TCurrentlyPlayedSong = z.infer<typeof CurrentlyPlayedSong>;

/**
 * End of file src/lib/types/songs.ts
 */