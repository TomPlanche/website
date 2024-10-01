<script lang="ts">
// Imports
import type { TWork } from "$lib/types";

// Variables
const localeDateOptions = {
	year: "2-digit",
	month: "short",
	day: "numeric",
};

// Props
export let experiences: TWork[];

// Functions
const formatDescription = (description: string): string[] => {
	return description.split("\n");
};
</script>


{#each experiences as experience}
  <article>
    <h3 class="title">
      <span>
        {experience.title}
        at
        <span class="company-infos">
          {#if experience.image}
            <img src={experience.image} alt={experience.company} />
          {/if}
          {experience.company}
        </span>
      </span>

      <span>
        {#if experience.tags}
          {#each experience.tags as tag}
            <span
                class="tag"
                style="
                  color: {tag.color || ''};
                  background-color: {tag.background || ''};
                "
            >{tag.name}</span>
          {/each}
        {/if}
        <span class="dates">
          {experience.from}
          {#if
            experience.to && experience.to !== experience.from
          } -
            {experience.to}
          {/if}
        </span>
      </span>

    </h3>

    <p>
      {#each formatDescription(experience.description) as line}
        {line}
        <br />
      {/each}
    </p>
  </article>
{/each}

<style lang="scss">
  $article-line-height: 1.75rem;
  $img-margin: .5rem;

  article {
    height: auto;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    padding: 1rem;

    border-bottom: 2px solid rgba(162, 162, 162, 0.1);

    &:hover {
      img {
        height: $article-line-height;
        width: auto;

        margin-right: $img-margin;
      }
    }


    h3 {
      width: 100%;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 1rem;

      line-height: $article-line-height;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: .25rem;
      }

      span {
        display: inline-flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        &.company-infos {
          margin-left: $img-margin;
        }

        &.dates,
        &.tag {
          font-family: "Departure Mono", monospace;
          font-size: 1rem;
        }

        &.tag {
          font-size: 1rem;
          font-weight: 900;
          margin-right: .5rem;
          padding: .25rem .5rem;
          border-radius: .75rem;

          background-color: rgba(162, 162, 162, 0.1);
        }
      }

      img {
        height: 0;
        width: auto;
        max-width: 20vmin;

        margin: 0;

        transition: height .3s,
        margin .3s;
      }
    }

    p {
      font-size: 1.25rem;
      font-weight: 400;

      text-align: justify;
      text-wrap: pretty;
    }

  }
</style>
