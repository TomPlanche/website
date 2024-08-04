<script lang="ts">
// Imports
import {
	RecentTrackSchema,
	type TRecentTrack,
} from "$lib/LastFMMiddleware/LastFMHandler";
import { lastFMStore } from "$lib/stores/lastFMStore";
import { gsap } from "gsap";
import { onMount } from "svelte";
import { fade, scale } from "svelte/transition";

// Variables
// Props
/**
 * Debug mode
 *
 * @type {boolean}
 */
export let debug: boolean;

/**
 * Show even if the song is not playing.
 * Use fake data.
 *
 * @type {boolean}
 */
export const showIfNotPlaying = false;

// Base variables
export const defaultSong = RecentTrackSchema.parse({
	artist: {
		mbid: "fda925d2-7af4-4b67-b8c1-692292c9cb18",
		"#text": "Cosmo Sheldrake",
	},
	streamable: false,
	image: [
		{
			size: "small",
			"#text":
				"https://lastfm.freetls.fastly.net/i/u/34s/742460b81269acbe6b34acc5cc6fdf22.jpg",
		},
		{
			size: "medium",
			"#text":
				"https://lastfm.freetls.fastly.net/i/u/64s/742460b81269acbe6b34acc5cc6fdf22.jpg",
		},

		{
			size: "large",
			"#text":
				"https://lastfm.freetls.fastly.net/i/u/174s/742460b81269acbe6b34acc5cc6fdf22.jpg",
		},
		{
			size: "extralarge",
			"#text":
				"https://lastfm.freetls.fastly.net/i/u/300x300/742460b81269acbe6b34acc5cc6fdf22.jpg",
		},
	],
	mbid: "f111f625-b623-4554-bc6f-dfa64c33b262",
	album: { mbid: "", "#text": "Stop the Music - Single" },
	name: "Does The Swallow Dream Of Flying",
	"@attr": { nowplaying: "true" },
	url: "https://www.last.fm/music/Cosmo+Sheldrake/_/Does+The+Swallow+Dream+Of+Flying",
});

let fetchTimeout: NodeJS.Timeout;

const containerStyleVars = {
	small: {
		height: "4rem",
		width: "4rem",
		mawWidth: "4rem",
	},
	large: {
		height: "6rem",
		width: "6rem",
		mawWidth: "20rem",
	},
};

// States
let isAnimating = false;
let localSong: TRecentTrack | false = false;
let size: "small" | "large" = "small";

// Bindings
const gsapTimeline: gsap.core.Timeline = gsap.timeline({
	onStart: () => {
		console.log("Animation started");
		isAnimating = true;
	},
	onComplete: () => {
		console.log("Animation complete");
		isAnimating = false;
	},
});

let container: HTMLDivElement;
let infos: HTMLDivElement;

// Functions
const handleContainerClick = (): Promise<null> => {
	return new Promise((resolve, reject) => {
		if (isAnimating) {
			console.log("Stopped");

			reject("Animation is already running");
			return;
		}

		switch (size) {
			case "small":
				size = "large";

				gsapTimeline
					.to(container, {
						duration: 0.2,
						width: containerStyleVars.large.width,
						height: containerStyleVars.large.height,
					})
					.to(container, {
						duration: 0.4,
						width: "auto",

						ease: "power2.out",
					})
					.fromTo(
						infos,
						{
							opacity: 0,
							y: 10,
						},
						{
							opacity: 1,
							y: 0,
							duration: 0.4,
							ease: "power2.out",

							onComplete: () => {
								resolve(null);
							},
						},
					);

				break;
			case "large":
				gsapTimeline
					.fromTo(
						infos,
						{
							opacity: 1,
							y: 0,
						},
						{
							opacity: 0,
							y: -10,
							duration: 0.4,
							ease: "power2.out",
						},
					)
					.to(container, {
						duration: 0.6,
						width: containerStyleVars.large.height,
						ease: "power2.out",
					})
					.to(container, {
						duration: 0.4,
						height: containerStyleVars.small.height,
						width: containerStyleVars.small.width,
						ease: "power2.out",
						onComplete: () => {
							size = "small";
							resolve(null);
						},
					});

				break;
		}
	});
};

/**
 * Compare two tracks to see if they are the same.
 *
 * @param track1 {TRecentTracksTrackAll} The first track to compare
 * @param track2 {TRecentTracksTrackAll | null} The second track to compare
 *
 * @returns {boolean} True if the tracks are the same, false otherwise
 */
const isSameTrack = (
	track1: TRecentTrack | false | null,
	track2: TRecentTrack | false | null,
): boolean => {
	if (!track1 || !track2) {
		return !track1 && !track2;
	}

	if (track1.mbid !== "" && track2.mbid !== "") {
		return track1.mbid === track2.mbid;
	}

	return (
		track1.name === track2.name &&
		track1.artist["#text"] === track2.artist["#text"]
	);
};

/**
 * Fetch the current song from the LastFM API.
 *
 * If the song is the same as the previous one, it will not update.
 *
 */
const fetchSong = async () => {
	debug && console.log("Fetching song");
	const res = await $lastFMStore.instance.getCurrentlyPlayingTrack();
	debug && console.log("Fetched song", res);

	if (res === false && showIfNotPlaying) {
		localSong = defaultSong;
		return;
	}

	if (isSameTrack(localSong, res)) {
		debug && console.log("Same song");

		if (res) {
			localSong = res;
		}
		return;
	}

	debug && console.log("Different song");

	if (size === "large") {
		handleContainerClick().then(async () => {
			localSong = res;

			await handleContainerClick();
		});
	} else {
		localSong = res;
	}
};

// Lifecycle
onMount(() => {
	fetchSong().then(() => {
		fetchTimeout = setInterval(fetchSong, 10000);
	});

	return () => {
		clearInterval(fetchTimeout);
	};
});
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
  <defs>
    <filter id="svgfilter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.3"
        numOctaves="1"
        seed="0"
        stitchTiles="stitch"
        result="feTurbulence-391ac80d"
      ></feTurbulence>
      <feGaussianBlur
        in="SourceGraphic"
        stdDeviation="2"
        edgeMode="duplicate"
        result="feGaussianBlur-85e146a6"
      ></feGaussianBlur>
      <feDisplacementMap
        in="feGaussianBlur-85e146a6"
        in2="feTurbulence-391ac80d"
        scale="37"
        xChannelSelector="A"
        yChannelSelector="A"
      ></feDisplacementMap>
    </filter>
  </defs>
</svg>

{#if localSong}
  <div
    class="container"


    aria-disabled="true"
    aria-hidden="true"

    on:click={handleContainerClick}
    bind:this={container}

    in:scale={{ duration: 200 }}
    out:scale={{ duration: 400 }}
  >
    <div class="artwork-container">
      <img src={localSong.image[localSong.image.length - 1]['#text']} alt="Song cover" />
    </div>

      <div
          class="container__infos"

          bind:this={infos}
      >
        {#if size === 'large'}
          <h2>{localSong.name}</h2>
          <h3>{localSong.artist['#text']}</h3>
        {/if}
      </div>
  </div>
{/if}

<style lang="scss">
  @import '../styles/variables';

  .container {
    position: fixed;

    bottom: 1rem;
    right: 1rem;

    height: 4rem;
    max-height: 6rem;
    width: 4rem;
    max-width: 20rem;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    backdrop-filter: url('#svgfilter');

    border-radius: 8px;
    padding: 4px;

    outline: 1px solid $outline-dark;

    .artwork-container {
      height: 100%;
      width: auto;

      img {
        height: 100%;
        width: auto;

        aspect-ratio: 1/1;

        border-radius: 4px;
      }
    }

    &__infos {
      height: 100%;
      width: 100%;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      h2, h3 {
        padding: 0 1rem;

        text-align: left;
        font-family: 'Radikal', serif;
        font-size: 1.1rem;
        font-weight: bold;

        // if the text is more than 2 lines, we want to hide the overflow
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

        // balance the text
        max-inline-size: 20ch;
        text-wrap: balance;

        line-height: 1.5rem;
      }
    }
  }
</style>
