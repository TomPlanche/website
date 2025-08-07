<script lang="ts">
  import { cursorEnter, cursorLeave } from "$lib/actions/cursor";
  import { gsap } from "gsap";
  import { Flip } from "gsap/Flip";
  import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
  import { SplitText } from "gsap/SplitText";
  import { onMount } from "svelte";

  gsap.registerPlugin(ScrambleTextPlugin);
  gsap.registerPlugin(SplitText);
  gsap.registerPlugin(Flip);

  const title = "Tom Planche";

  // Bindings
  let titleRef: HTMLHeadingElement;
  let WIPRef: HTMLParagraphElement;
  let projectsButtonRef: HTMLAnchorElement;

  let introAnimationIsOver = $state(false);

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

      // Initially hide the projects button
      gsap.set(projectsButtonRef, { opacity: 0, y: 20 });

      tl.set(splittedTitle.chars, { opacity: 0 })
        .to(titleRef, {
          scrambleText: {
            text: title,
            chars: title
              .replace(/a/g, "4")
              .replace(/e/g, "3")
              .replace(/o/g, "O"),
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

              introAnimationIsOver = true;
            },
          },
        )
        .to(
          projectsButtonRef,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power4.out",
          },
          "-=0.2",
        );
    });
  });
</script>

<section id="intro">
  <div class="title">
    <h1 bind:this={titleRef}>Tom Planche</h1>
    <h2 bind:this={WIPRef}>French Software Engineer based in Paris</h2>
    <a
      bind:this={projectsButtonRef}
      class="projects-button"
      href="/projects"
      rel="next"
      use:cursorEnter
      use:cursorLeave
    >
      see projects
    </a>
  </div>
</section>

<style lang="scss">
  @use "$lib/styles/variables";

  #intro {
    min-height: 100dvh;
    height: 100%;
    width: 100%;

    padding: variables.$main-padding;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    h1,
    h2 {
      text-shadow: 0 0 5px var(--text-color);
      font-family: "Mondwest", sans-serif;
    }

    h1 {
      font-family: "Mondwest", monospace;
      font-size: 9vw;
      text-shadow: 0 0 5px var(--text-color);
      font-weight: 900;
      text-align: center;
    }

    h2 {
      font-family: "FK Raster Grotesk Compact Blended", sans-serif;
      font-kerning: none;
      font-size: 3vw;
      letter-spacing: 0.15rem;
    }

    .projects-button {
      font-family: "Zed Plex Mono", monospace;
      font-size: 1.2rem;
      font-weight: 500;
      text-decoration: none;
      color: var(--text-color);

      padding: 0.75rem 2rem;
      margin-top: 1rem;

      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 2rem;
      background: rgba(255, 255, 255, 0.05);

      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);

      transition:
        background 0.3s ease,
        border-color 0.3s ease,
        box-shadow 0.3s ease;

      pointer-events: auto;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }
    }
  }
</style>
