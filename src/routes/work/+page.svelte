<script lang="ts">
// Imports
import Work from "$lib/components/Work.svelte";
import { mainStore } from "$lib/stores/mainStore";
import type { TWork } from "$lib/types";
import { onMount } from "svelte";

// Variables
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

// Functions

// Lifecycle
onMount(() => {
	$mainStore.loadingAnimationIsDone = true;
});
</script>

<section>
  <h2>Work Experience</h2>

  <Work {experiences} />
</section>

<style lang="scss">
  section {
    align-self: flex-start;

    width: 100%;

    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
  }
</style>
