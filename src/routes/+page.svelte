<script lang="ts">
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { onMount } from "svelte";

gsap.registerPlugin(ScrambleTextPlugin);
gsap.registerPlugin(SplitText);

// Bindings
let titleRef: HTMLHeadingElement;
let WIPRef: HTMLParagraphElement;

const title = "Tom Planche";

// Initialize animations
onMount(() => {
  if (!titleRef || !WIPRef) {
    console.error("Title or WIP reference is not set");
    return;
  }

  document.fonts.ready.then(() => {
    const splittedTitle = new SplitText(WIPRef, { type: "chars" });

    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power2.out",
      },
    });

    tl.set(splittedTitle.chars, { opacity: 0 })
      .to(titleRef, {
        scrambleText: {
          text: title,
          chars: title.replace(/a/g, "4").replace(/e/g, "3").replace(/o/g, "O"),
          revealDelay: 0.625,
        },
        duration: 1,
      })
      .fromTo(
        splittedTitle.chars,
        {
          opacity: 0,
          translateY: "1rem",
        },
        {
          opacity: 1,
          translateY: 0,
          stagger: 0.01,
          duration: 0.25,
          onComplete: () => {
            splittedTitle.revert();
          },
        },
      );
  });
});
</script>

<section
    id="intro"
>
  <h1
      bind:this={titleRef}
  >
    Tom Planche
  </h1>
  <p
      bind:this={WIPRef}
  >
    French Software Engineer based in Paris.
  </p>
</section>

<style lang="scss">
  @use '$lib/styles/variables';

  section {
    min-height: variables.$min-main-height;
    height: 100%;
    width: 100%;

    padding: variables.$main-elem-padding;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;


    &#intro {
      h1 {
        font-family: "Mondwest", monospace;
        font-size: 9vw;
        text-shadow: 0 0 5px var(--text-color);
        font-weight: 900;
        text-align: left;
      }

      h1, p {
        text-shadow: 0 0 5px var(--text-color);
      }

      p {
        font-family: "Mondwest", sans-serif;
        font-size: 3vw;
        text-align: justify;
        line-height: 1.5;
        font-kerning: none;
      }
    }
  }
</style>