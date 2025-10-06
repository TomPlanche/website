import type { TGetSourcesResponse, TLogSourceResponse, TSources, } from "$lib/types/analytics";
import type { TBackendResponse } from "./back";
import { getRecentTracksSchema, type TGetRecentTracks } from "./lastfm";
import type { Sticker } from "./sticker";

interface ApiResponse<T = unknown> {
  status: number;
  success: boolean;
  data: T;
  error?: {
    message: string;
  };
}

export type TCursor = {
  isHover: boolean;
  scale: number;
  opacity: number;
  svg: string;
  innerText: string;
  backgroundColor: string;
  blur: number;
};

export type TCursorOptions = {
  [key in keyof TCursor]?: TCursor[key];
};

export type ActionReturn<P> = {
  update?: (newParams: P) => void;
  destroy?: () => void;
};

export type Action<P = void> = (
  node: HTMLElement,
  params?: P,
) => ActionReturn<P> | undefined;

export type {
  TSources,
  TGetSourcesResponse,
  TLogSourceResponse,
  TGetRecentTracks,
  TBackendResponse,
};

// GET /stickers - Get all stickers
interface GetStickersResponse
  extends ApiResponse<{
    stickers: Sticker[];
  }> {}

// GET /stickers/:id - Get single sticker
interface GetStickerResponse
  extends ApiResponse<{
    sticker: Sticker;
  }> {}

// POST /stickers - Create sticker
interface CreateStickerResponse
  extends ApiResponse<{
    sticker: Sticker;
  }> {}

export type { ApiResponse };
export { getRecentTracksSchema };
export type {
  GetStickersResponse,
  GetStickerResponse,
  CreateStickerResponse,
  Sticker,
};
