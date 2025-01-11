/**
 * @file src/lib/actions/cursor.ts
 * @description Cursor actions for handling cursor interactions
 */
import { refStore } from '../stores/refStore';
import { get } from 'svelte/store';
import type { TCursorOptions } from '../types';

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
 * @param options {TCursorOptions} - Cursor options to apply on enter
 */
export const cursorEnter = (node: HTMLElement, options: TCursorOptions = defaultEnterOptions) => {
  const handleEnter = () => {
    const cursor = get(refStore).cursor;
    if (cursor) {
      cursor.setCursorParams({ ...options, isHover: true });
    }
  };

  node.addEventListener('mouseenter', handleEnter);

  return {
    destroy() {
      node.removeEventListener('mouseenter', handleEnter);
    }
  };
}

/**
 * Action for handling cursor leave events
 * @param node {HTMLElement} - The element to attach the action to
 * @param options {TCursorOptions} - Cursor options to apply on leave
 */
export const cursorLeave = (node: HTMLElement, options: TCursorOptions = defaultLeaveOptions) => {
  const handleLeave = () => {
    const cursor = get(refStore).cursor;
    if (cursor) {
      // @ts-ignore - we know setCursorParams exists on the cursor component
      cursor.setCursorParams({ ...options, isHover: false });
    }
  };

  node.addEventListener('mouseleave', handleLeave);

  return {
    destroy() {
      node.removeEventListener('mouseleave', handleLeave);
    }
  };
} 