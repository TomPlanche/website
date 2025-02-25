/**
 * @file src/lib/types/lastfm.ts
 * @description lastfm
 * @author Tom Planche
 */
import {z} from "zod";


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
export type TRecentTrackWithCount = z.infer<typeof RecentTrackSchema> & { count: number };

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


/**
 * End of file src/lib/types/lastfm.ts
 */