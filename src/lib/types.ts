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


export type ActionReturn<P> = {
  update?: (newParams: P) => void;
  destroy?: () => void;
};

export type Action<P = void> = (
  node: HTMLElement,
  params?: P
) => ActionReturn<P> | void;

// For components that can accept actions
export type UseProps = {
  action: Action;
  props?: Record<string, unknown>;
};

/**
 * End of file src/lib/types.ts
 */
