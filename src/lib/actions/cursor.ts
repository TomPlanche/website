import { get } from "svelte/store"; /**
 * @file src/lib/actions/cursor.ts
 * @description Cursor actions for handling cursor interactions
 */
import { refStore } from "../stores/refStore";
import type { Action, ActionReturn, TCursorOptions } from "../types/";

const defaultEnterOptions: TCursorOptions = {
  isHover: true,
  opacity: 0.75,
  scale: 1.5,
};

const defaultLeaveOptions: TCursorOptions = {
  isHover: false,
  opacity: 1,
  scale: 1,
};

/**
 * Action for handling cursor enter events
 * @param node {HTMLElement} - The element to attach the action to
 * @param params {TCursorOptions} - Cursor options to apply on enter
 */
export const cursorEnter: Action<TCursorOptions> = (
  node: HTMLElement,
  params: TCursorOptions = defaultEnterOptions,
): ActionReturn<TCursorOptions> => {
  const handleEnter = () => {
    const cursor = get(refStore).cursor;
    if (cursor) {
      cursor.setCursorParams({ ...params, isHover: true });
    }
  };

  node.addEventListener("mouseenter", handleEnter);

  return {
    destroy() {
      node.removeEventListener("mouseenter", handleEnter);
    },
  };
};

/**
 * Action for handling cursor leave events
 * @param node {HTMLElement} - The element to attach the action to
 * @param params {TCursorOptions} - Cursor options to apply on leave
 */
export const cursorLeave: Action<TCursorOptions> = (
  node: HTMLElement,
  params: TCursorOptions = defaultLeaveOptions,
): ActionReturn<TCursorOptions> => {
  const handleLeave = () => {
    const cursor = get(refStore).cursor;
    if (cursor) {
      cursor.setCursorParams({ ...params, isHover: false });
    }
  };

  node.addEventListener("mouseleave", handleLeave);

  return {
    destroy() {
      node.removeEventListener("mouseleave", handleLeave);
    },
  };
};
