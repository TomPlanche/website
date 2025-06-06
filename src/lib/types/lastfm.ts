import { z } from "zod";

const BaseObjectSchemaNoMbid = z.object({
  url: z.string(),
  name: z.string(),
});

const BaseObjectSchema = BaseObjectSchemaNoMbid.extend({
  mbid: z.string(),
});

const DateSchema = z.object({
  uts: z.union([
    z.coerce.date(),
    z.coerce.number().transform((v) => new Date(v * 1000)),
  ]),
  "#text": z.coerce.date(),
});

const TrackImageSchema = z.object({
  size: z.string(),
  "#text": z.string(),
});

const RecentTrackArtistSchema = z.object({
  mbid: z.string(),
  "#text": z.string(),
});

const RecentTrackExtendedArtistSchema = RecentTrackArtistSchema.extend({
  "#text": z.union([z.undefined(), z.never()]), // Not present in the response
  image: z.array(TrackImageSchema),
});

export const RecentTrackSchema = BaseObjectSchema.extend({
  artist: z.union([
    z.object({
      mbid: z.string(),
      "#text": z.string(),
    }),
    RecentTrackExtendedArtistSchema,
  ]),
  streamable: z.coerce.number().pipe(z.coerce.boolean()),
  image: z.array(TrackImageSchema),
  album: z.object({
    mbid: z.string(),
    "#text": z.string(),
  }),
  "@attr": z
    .object({
      nowplaying: z.union([
        z.boolean(),
        z
          .union([z.literal("true"), z.literal("false")])
          .transform((v) => v === "true"),
      ]),
    })
    .optional(),
  date: DateSchema.optional(),
  // the 'loved' field is not present in the response

  loved: z.coerce.number().pipe(z.coerce.boolean()).optional(),
});

export type TRecentTrack = z.infer<typeof RecentTrackSchema>;

export const BaseResponseSchema = z.object({
  user: z.string(),
  totalPages: z.coerce.number(),
  page: z.coerce.number(),
  perPage: z.coerce.number(),
  total: z.coerce.number(),
});

export const getRecentTracksSchema = z.object({
  recenttracks: z.object({
    track: z.array(RecentTrackSchema),
    "@attr": BaseResponseSchema,
  }),
});

export type TGetRecentTracks = z.infer<typeof getRecentTracksSchema>;

/*
[
  {
    "name": "Make You Move",
    "play_count": 1,
    "artist": "Carv",
    "album": "Make You Move - Single",
    "image_url": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png",
    "currently_playing": true
  }
]
 */
export const BackendSongSchema = z.object({
  name: z.string(),
  play_count: z.number(),
  artist: z.string(),
  album: z.string(),
  image_url: z.string(),
  currently_playing: z.boolean(),
  // date: 1740691900
  date: z
    .union([
      z.coerce.date(),
      z.coerce.number().transform((v) => new Date(v * 1000)),
    ])
    .optional(),
  url: z.string(),
});

export type TBackendSong = z.infer<typeof BackendSongSchema>;
