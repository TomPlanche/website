<script lang="ts">
import { mainStore } from "$lib/stores/mainStore";
import { onMount } from "svelte";

import Hoverable from "$lib/components/Hoverable.svelte";
import Magnetic from "$lib/components/Magnetic.svelte";
import Spacer from "$lib/components/Spacer.svelte";
import Work from "$lib/components/Work.svelte";
import { mainTopPadding } from "$lib/globals";
import type { TWork } from "$lib/types";
import { gsap } from "gsap";

// Variables
const titleContent = "Tom Planche";

const experiences: TWork[] = [
	{
		title: "Backend Developer",
		company: "Crealo",
		description:
			"Single-handed implementation of a new functionality (copyright assignment management).\n" +
			"Development of DB schemas, integration of new tools, clean and commented code combined " +
			"with documentation to facilitate handover to the next developers.",
		from: new Date("2024-07-01").toLocaleDateString("EN", {
			month: "long",
			year: "numeric",
		}),
		image: "logos/logo-crealo.png",
		tags: [
			{
				name: "Freelance",
			},
		],
	},
	{
		title: "Backend Developer",
		company: "Crealo",
		description:
			"Creation of middleware based on OpenID, OAuth 2.0 and FTP to facilitate integration (Bexio, Dilisco, Sage, ...).\n" +
			"Data scraping in Rust for the client team.\n" +
			"R&D with Textract AWS",
		from: new Date("2024-03-01").toLocaleDateString("EN", {
			month: "long",
			year: "numeric",
		}),
		to: new Date("2024-06-01").toLocaleDateString("EN", {
			month: "long",
			year: "numeric",
		}),
		image: "logos/logo-crealo.png",
		tags: [
			{
				name: "Internship",
			},
		],
	},
	{
		title: "Fullstack Developer",
		company: "Redbox",
		description:
			"Creation of requested customer functionalities.\n" +
			"Creation of PDFs pre-filled with customer data from the site, creation of new pages, implementation of new features.",
		from: new Date("2023-04-01").toLocaleDateString("EN", {
			month: "long",
			year: "numeric",
		}),
		to: new Date("2023-06-01").toLocaleDateString("EN", {
			month: "long",
			year: "numeric",
		}),
		image: "logos/logo-redbox.svg",
		tags: [
			{
				name: "Internship",
			},
		],
	},
];

const blurTriggerIsHovered = false;

// Binds
let title: HTMLHeadingElement;
let subtitle: HTMLHeadingElement;

// Watchers

// Lifecycle
onMount(() => {
	$mainStore.loadingAnimationIsDone = true;

	const mainTimeline = gsap.timeline({
		defaults: { duration: 0.5, ease: "power2.out" },
		onStart: () => {
			$mainStore.loadingAnimationIsDone = false;
		},
		onComplete: () => {
			$mainStore.loadingAnimationIsDone = true;
		},
	});

	mainTimeline
		.set([title, subtitle], { opacity: 0 })
		.set(subtitle, { y: "50%" })
		.to(title, {
			opacity: 1,
			duration: 1,
		})
		.to(subtitle, {
			opacity: 1,
			y: "0%",
			duration: 0.5,
			ease: "power2.out",
		});
});
</script>

<section id="home">
    <h1 bind:this={title}>{titleContent}</h1>
    <h2 bind:this={subtitle}>I do <span>stuff</span> with code</h2>
</section>

{#if $mainStore.loadingAnimationIsDone}
  <Spacer height={mainTopPadding}/>

  <section>
    <p>
      Hey there! I'm <Hoverable>Tom</Hoverable>, a software engineer with a strong focus on
      backend development, but comfortable across the full stack.
      <br/>
      Currently
      <span class="important"
      >studying at <a href="www.cnam.fr">le CNAM </a></span
      >
      in Paris as a <span class="important">software engineer</span>.
    </p>
  </section>

  <section>
    <h3>Work Experience</h3>

    <Work {experiences}/>
  </section>
{/if}

<style lang="scss">
  @use "sass:color";

  @import "$lib/styles/variables";

  * {
    @include no-user-select();
  }

  section {
    align-self: flex-start;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    &#home {
      min-height: $main-min-height;
      justify-content: center;
    }

    &:not(#home) {
      margin-top: 5rem;
    }

    h1,
    h2 {
      text-align: left;
      font-family: "Mondwest", serif;
      text-shadow: 0 0 5px $main-color;
    }

    h1 {
      font-size: 10vw;
      font-weight: 900;
    }

    h2 {
      font-size: 7vw;
      font-weight: 400;
    }

    h3 {
      font-size: 6vw;
      align-self: flex-start;
    }

    p {
      font-family: "Charlevoix", sans-serif;
      font-size: 2rem;
      text-align: justify;
      padding: 1rem;

      align-self: flex-start;

      line-height: 1.5;
    }
  }
</style>
