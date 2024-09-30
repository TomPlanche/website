<script lang="ts">
// Imports
import { gsap } from "gsap";

import type { TWork } from "$lib/components/Work.svelte";

// Variables

const experiences: TWork[] = [
	{
		title: "Freelance Backend Developer",
		company: "Crealo",
		description:
			"Single-handed implementation of a new functionality (copyright assignment management).\n" +
			"Development of DB schemas, integration of new tools, clean and commented code combined\n" +
			"with documentation to facilitate handover to the next developers.",
		// 1st of July 2024
		from: new Date("2024-07-01"),
		// 30th of July 2024
		to: new Date("2024-07-30"),

		image: "logos/logoCrealo.png",
	},
];

// Functions
const articleHandleMouseEnter = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	const imgWrapper = target.querySelector(".img-wrapper") as HTMLElement;

	if (!imgWrapper) return;

	const img = imgWrapper.querySelector("img") as HTMLImageElement;

	const tl = gsap.timeline({
		defaults: { duration: 0.4, ease: "power2.out" },
	});

	tl.fromTo(
		imgWrapper,
		{
			width: img.width,
			scale: 0,
		},
		{
			scale: 1,
		},
	);
};

const articleHandleMouseLeave = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	const imgWrapper = target.querySelector(".img-wrapper") as HTMLElement;

	if (!imgWrapper) return;

	const tl = gsap.timeline({
		defaults: { duration: 0.4, ease: "power2.out" },
	});

	tl.to(imgWrapper, {
		width: 0,
		scale: 0,
	});
};
</script>

<section>
  <h2>Work Experience</h2>

  {#each experiences as experience}
    <article>
      <div>
        <h3>
          {experience.title}
          at
          {#if experience.image}
            <figure><img src={experience.image} alt={experience.company} /></figure>
          {/if}
          <span>{experience.company}</span>
        </h3>
        <p>{experience.description}</p>
      </div>
    </article>
  {/each}
</section>

<style lang="scss">
  @import '../../lib/styles/variables';

  section {
    align-self: flex-start;

    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    article {
      height: clamp(10rem, 20vh, 30rem);
      margin-bottom: 2rem;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      padding: 1rem;

      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

      &:hover {
        figure {
          width: 2rem;

          img {
            scale: 1;
            transform: translateX(0);
          }
        }
      }

      div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;

        h3 {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;

          span {
            background: $app-bg-dark;
            z-index: 3;
          }

          figure {
            width: 0;
            margin: 0 .25rem;

            z-index: 2;

            transition: width 0.4s;

            img {
              max-height: 2rem;
              width: auto;

              scale: 0;
              transform: translateX(-100%);

              transition: scale 0.4s, transform 0.4s;

            }
          }
        }

        p {
          font-size: 1rem;
          font-weight: 400;
        }
      }
    }
  }
</style>
