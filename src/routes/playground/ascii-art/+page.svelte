<script lang="ts">
import { onMount } from "svelte";

import { mainStore } from "$lib/stores/mainStore";

import P5 from "p5-svelte";
import {
	ButtonGrid,
	type ButtonGridClickEvent,
	Checkbox,
	IntervalSlider,
	List,
	type ListOptions,
	Pane,
	Separator,
	Text,
} from "svelte-tweakpane-ui";
import type { PageData } from "/.svelte-kit/types/src/routes/playground/";

// Load data from the `+page.ts` file
export let data: PageData;

/**
 * PANE
 */
let gridSquareSize = 16;

const thresholds: {
	min: number;
	max: number;
	values: [number, number];
} = {
	min: 0,
	max: 255,
	values: [20, 220],
};

const wide = true;

const debugMode = false;
const fillMode = false;

const charSet = " .,:;i1tfLCG08#@";

const imageIndex = 0;
let imageSrc;

$: imageSrc = data.files[imageIndex].link;

const options: ListOptions<number> = {};
$: data.files.map((f, index) => {
	const key = f.name;
	options[key] = index;
});

enum gridSquareButton {
	MINUS = "-",
	PLUS = "+",
}

const incrementGridSquareSize = () => {
	if (gridSquareSize >= 32) return;

	gridSquareSize += 4;
};

const decrementGridSquareSize = () => {
	if (gridSquareSize <= 8) return;

	gridSquareSize -= 4;
};

const handleGridSquareSize = (event: ButtonGridClickEvent) => {
	const button = event.detail.label as gridSquareButton;

	switch (button) {
		case gridSquareButton.MINUS:
			decrementGridSquareSize();
			break;
		case gridSquareButton.PLUS:
			incrementGridSquareSize();
			break;
	}
};

let p5Instance: any;

/**
 * Sketch
 */
const sketch = (p5) => {
	let currentImage;
	let images;

	/**
	 *
	 * @param {number} brightness
	 *
	 */
	const mapCorrectChar = (brightness: number) => {
		return charSet[
			Math.floor(
				p5.map(
					brightness,
					thresholds.values[0],
					thresholds.values[1],
					0,
					charSet.length,
				),
			)
		];
	};

	p5.preload = () => {
		images = data.files.map((f) => {
			return p5.loadImage(f.link);
		});
	};

	const resizeCanvas = (create = false) => {
		const availableWidth = p5.windowWidth;
		const availableHeight = p5.windowHeight;

		const imageAspectRatio = currentImage.height / currentImage.width;

		let canvasWidth, canvasHeight;

		// Calculate maximum dimensions while maintaining aspect ratio
		if (
			availableWidth / availableHeight >
			currentImage.width / currentImage.height
		) {
			// Available space is wider than the image
			canvasHeight = availableHeight;
			canvasWidth = availableHeight / imageAspectRatio;
		} else {
			// Available space is taller than the image
			canvasWidth = availableWidth;
			canvasHeight = availableWidth * imageAspectRatio;
		}

		// Ensure dimensions are multiples of gridSquareSize
		canvasWidth = Math.floor(canvasWidth / gridSquareSize) * gridSquareSize;
		canvasHeight = Math.floor(canvasHeight / gridSquareSize) * gridSquareSize;

		// Create or resize the canvas
		if (create) {
			p5.createCanvas(canvasWidth, canvasHeight);
		} else {
			p5.resizeCanvas(canvasWidth, canvasHeight);
		}
	};

	const resizeImage = () => {
		resizeCanvas();

		p5.image(currentImage, 0, 0, p5.width, p5.height);
		currentImage.resize(p5.width, p5.height);
	};

	p5.setup = () => {
		currentImage = images[imageIndex];

		p5.background(255);

		resizeCanvas(true);
		p5Instance = p5;
	};

	p5.draw = () => {
		currentImage = images[imageIndex];

		resizeImage();

		p5.background(0);
		currentImage.loadPixels();

		const xSteps = currentImage.width / gridSquareSize;
		const ySteps = currentImage.height / gridSquareSize;

		p5.textSize(10);
		p5.textAlign(p5.CENTER, p5.CENTER);

		for (let x = 0; x < xSteps; x++) {
			for (let y = 0; y < ySteps; y++) {
				const xStart = x * gridSquareSize;
				const yStart = y * gridSquareSize;

				const color = currentImage.get(xStart, yStart);
				p5.fill(color);

				const brightness =
					(p5.red(color) + p5.green(color) + p5.blue(color)) / 3;

				const isInThreshold =
					brightness >= thresholds.values[0] &&
					brightness <= thresholds.values[1];

				if (isInThreshold) {
					if (fillMode) {
						p5.rect(xStart, yStart, gridSquareSize, gridSquareSize);
						p5.fill(255);
					}

					const char = debugMode
						? brightness.toFixed(0)
						: mapCorrectChar(brightness);

					p5.textSize(gridSquareSize * 0.9);
					p5.text(
						char,
						xStart + gridSquareSize / 2,
						yStart + gridSquareSize / 2,
					);
				}
			}
		}

		p5.noLoop();
	};

	p5.windowResized = () => {
		resizeCanvas();
	};
};

const restart = () => {
	p5Instance.draw();
};

// Reactive statements to trigger redraw when variables change
$: if (
	(fillMode !== undefined ||
		debugMode !== undefined ||
		gridSquareSize ||
		thresholds.values ||
		imageSrc ||
		charSet) &&
	p5Instance
) {
	restart();
}

// Lifecycle
onMount(() => {
	$mainStore.hideCursor = true;
});
</script>

<Pane
    title="Settings"
    expanded
    width={300}
>
  <List bind:value={imageIndex} label="Alphanumerics" {options}/>

  <Separator/>

  <Text label="Character Set" bind:value={charSet}/>

  <Separator/>

  <!-- Grid Square Size button group -->
  <ButtonGrid
      label="Grid Square Size"
      buttons={[
			"-", "+"
		]}
      on:click={handleGridSquareSize}
  />

  <Separator/>

  <IntervalSlider
      label="Thresholds"
      bind:value={thresholds.values}
      min={thresholds.min}
      max={thresholds.max}

      {wide}
  />

  <Separator/>

  <Checkbox bind:value={debugMode} label="Debug Mode"/>
  <Checkbox bind:value={fillMode} label="Fill Mode"/>
</Pane>

<P5 {sketch}/>