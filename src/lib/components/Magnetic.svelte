<script lang="ts">
/**
 * TODO: Add `mode` prop to choose between `center` and `keepInField`.
 */

// Imports
import { mapRange } from "$lib/globals";
import { type SpringOpts, spring } from "svelte/motion";
import { map } from "zod";

// Variables
interface Props {
	block?: boolean; // Block the effect
	debug?: boolean; // Debug mode
	force?: number | [number, number]; // The force of the effect
	fieldSize?: number | [number, number]; // The size of the field, 1 is the full container, 2 is the double of the container, etc.
	invert?: boolean; // Invert the effect direction
	springOptions?: SpringOpts; // The spring options
}

const defaultProps: Required<Props> = {
	block: false,
	debug: false,
	force: 1,
	fieldSize: 1,
	invert: false,
	springOptions: {
		stiffness: 0.3,
		damping: 0.8,
		precision: 0.1,
	},
};

// biome-ignore lint/no-let-const-assignment
export let { block, debug, fieldSize, force, invert, springOptions }: Props =
	defaultProps;

let _windowScrollX = 0;
let _windowScrollY = 0;

const contentX = spring(0, springOptions);
const contentY = spring(0, springOptions);

// bindings
let container: HTMLElement;
let content: HTMLElement;
let debugField: HTMLDivElement;
let debugForceField: HTMLDivElement;

// Watchers
$: if (content) {
	content.style.transform = `translate(${$contentX}px, ${$contentY}px)`;
}

$: _force = force || defaultProps.force;
$: _forceX = typeof _force === "number" ? _force : _force[0];
$: _forceY = typeof _force === "number" ? _force : _force[1];
$: _invert = invert ? -1 : 1;
$: _fieldSizeX =
	typeof fieldSize === "number" ? fieldSize : fieldSize?.[0] ?? 1;
$: _fieldSizeY =
	typeof fieldSize === "number" ? fieldSize : fieldSize?.[1] ?? 1;

$: console.log(_windowScrollX);

$: if (debug) {
	console.log(
		`Magnetic effect: block=${block}, debug=${debug}, forceX=${_forceX}, forceY=${_forceY}, invert=${_invert}, fieldSizeX=${_fieldSizeX}, fieldSizeY=${_fieldSizeY}`,
	);
}

$: if (container && debug) {
	const containerRect = container.getBoundingClientRect();

	if (containerRect) {
		updateDebugField(containerRect, debugField, _fieldSizeX, _fieldSizeY);
		updateDebugField(
			containerRect,
			debugForceField,
			_fieldSizeX * _forceX,
			_fieldSizeY * _forceY,
		);
	}
}

// Functions
/**
 * Handle window scroll
 *
 * @param _e {Event} The scroll event
 */
const handleWindowScroll = (_e: Event) => {
	_windowScrollX = window.scrollX;
	_windowScrollY = window.scrollY;

	if (block || !content) {
		return;
	}

	updateDebugField(
		container.getBoundingClientRect(),
		debugField,
		_fieldSizeX,
		_fieldSizeY,
	);

	updateDebugField(
		container.getBoundingClientRect(),
		debugForceField,
		_fieldSizeX * _forceX,
		_fieldSizeY * _forceY,
	);
};

/**
 * Update the debug field
 *
 * @param containerRect {DOMRect} The container rect
 * @param field {HTMLDivElement} The debug field
 * @param scaleX {number} The scale on the X axis
 * @param scaleY {number} The scale on the Y axis
 */
const updateDebugField = (
	containerRect: DOMRect,
	field: HTMLDivElement,
	scaleX: number,
	scaleY: number,
) => {
	if (!field) return;

	const width = containerRect.width * scaleX;
	const height = containerRect.height * scaleY;

	field.style.width = `${width}px`;
	field.style.height = `${height}px`;
	field.style.left = `${containerRect.left - (width - containerRect.width) / 2}px`;
	field.style.top = `${containerRect.top - (height - containerRect.height) / 2}px`;
};

/**
 * Handle mouse move
 *
 * @param e {MouseEvent} The mouse event
 */
const handleMouseMove = (e: MouseEvent) => {
	if (block || !container || !content) {
		return;
	}

	const { clientX, clientY } = e;
	const { left, top, width, height } = container.getBoundingClientRect();

	// Calculate the field boundaries
	const fieldWidth = width * _fieldSizeX;
	const fieldHeight = height * _fieldSizeY;
	const fieldLeft = left - (fieldWidth - width) / 2;
	const fieldTop = top - (fieldHeight - height) / 2;

	// Check if the mouse is within the field
	if (
		clientX < fieldLeft ||
		clientX > fieldLeft + fieldWidth ||
		clientY < fieldTop ||
		clientY > fieldTop + fieldHeight
	) {
		handleMouseLeave();
		return;
	}

	// remap the mouse position to the container to a range of -1 to 1
	const x = mapRange(clientX, fieldLeft, fieldLeft + fieldWidth, -1, 1);
	const y = mapRange(clientY, fieldTop, fieldTop + fieldHeight, -1, 1);

	// calculate the new position of the container
	const newX = ((x * _forceX * width) / 4) * _invert;
	const newY = ((y * _forceY * height) / 2) * _invert;

	// apply the new position to the container
	contentX.set(newX);
	contentY.set(newY);
};

/**
 * Reset the container position
 */
const handleMouseLeave = () => {
	if (block || !content) {
		return;
	}

	contentX.set(0);
	contentY.set(0);
};
</script>

<svelte:window
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
    on:scroll={handleWindowScroll}
/>

{#if debug}
    <div id="debug-field" bind:this={debugField}></div>
    <div id="debuf-field-limit" bind:this={debugForceField}></div>
{/if}

<div
    class="container"
    bind:this={container}
    class:debug
    on:mouseleave={handleMouseLeave}
    aria-hidden="true"
>
    <div class="content" bind:this={content}>
        <slot />
    </div>
</div>

<style lang="scss">
    #debug-field {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;

        outline: 2px dotted red;
    }

    #debuf-field-limit {
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;

        outline: 2px dotted green;
    }

    .container {
        &.debug {
            .content {
                background-color: rgba(0, 0, 255, 0.1);
                outline: 2px solid blue;
            }
        }

        .content {
            pointer-events: none;
        }
    }
</style>
