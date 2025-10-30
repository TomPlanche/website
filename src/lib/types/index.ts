import type {
  TGetSourcesResponse,
  TLogSourceResponse,
  TSources,
} from "$lib/types/analytics";
import type { TBackendResponse } from "./back";
import { getRecentTracksSchema, type TGetRecentTracks } from "./lastfm";

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
export { getRecentTracksSchema };
