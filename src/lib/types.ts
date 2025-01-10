/**
 * @file src/lib/types.ts
 * @description types
 * @author Tom Planche
 */

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

export type TOnEnter = (cursorOptions?: TCursorOptions) => void;

export type TOnLeave = TOnEnter;

/**
 * End of file src/lib/types.ts
 */
