/**
 * @file src/lib/actions/cursor.ts
 * @description Cursor actions for handling cursor interactions
 */

import { get } from 'svelte/store';
import { refStore } from '../stores/refStore';
import type { TCursorOptions } from '../types';

/**
 * Action for handling cursor enter events
 * @param node - The element to attach the action to
 * @param options - Cursor options to apply on enter
 */
export function cursorEnter(node: HTMLElement, options: TCursorOptions = { isHover: true }) {
  const handleEnter = () => {
    const cursor = get(refStore).cursor;
    if (cursor) {
      // @ts-ignore - we know setCursorParams exists on the cursor component
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
 * @param node - The element to attach the action to
 * @param options - Cursor options to apply on leave
 */
export function cursorLeave(node: HTMLElement, options: TCursorOptions = { isHover: false }) {
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