<script lang="ts">
  // Imports
  import { fade } from 'svelte/transition';
  import { gsap } from 'gsap/dist/gsap';
  import { SplitText } from 'gsap/dist/SplitText';
  import { LINKS, store } from '$lib/appStore';
  import Hoverable from '$lib/components/Hoverable.svelte';

  gsap.registerPlugin(SplitText);

  // Variables
  const links = Object.values(LINKS);

  // Functions
  const handleFontChange = () => {
    document.body.classList.toggle('colored');
  };

  const handleMouseHoverLink = (itemId: string) => {
    const link = document.querySelector(`#${itemId} .link`);
    const splitText = new SplitText(link, { type: 'words,chars' });
    const combinedCharsAnimated = 2;
    const duration = 0.5; // per character

    const tl = gsap.timeline({
      defaults: {
        duration: duration,
        ease: 'power2.out',
        stagger: duration / splitText.chars.length / combinedCharsAnimated
      }
    });

    tl.to(splitText.chars, {
      backgroundColor: 'rgb(24 41 56 / 1)',
      color: '#080a13'
    }).to(
      splitText.chars,
      {
        backgroundColor: 'rgb(24 41 56 / 1)',
        color: 'rgba(205, 201, 255)'
      },
      `<${duration / 2}`
    );
  };
</script>

<header in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
  <span>
    <Hoverable>
      <button aria-hidden="true" on:click={handleFontChange}> T </button>
    </Hoverable>
  </span>

  <nav>
    <ul>
      {#each links as link}
        <li>
          <Hoverable>
            <a
              id={`link_${link}`}
              href={`/${link === LINKS.HOME ? '' : link}`}
              class={link === $store.currentLink ? 'active' : ''}
              on:mouseenter={() => handleMouseHoverLink(`link_${link}`)}
            >
              [<span>+</span>]<span class="link">{link}</span>
            </a>
          </Hoverable>
        </li>
      {/each}
    </ul>
  </nav>
</header>

<style lang="scss">
  @import '$lib/styles/variables';

  header {
    height: 5rem;
    padding: 0 2.5rem;

    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    span {
      button {
        font-family: 'ColorFont', sans-serif;
        font-size: 2.5rem;
      }
    }

    nav {
      ul {
        display: flex;
        gap: 2rem;

        li {
          list-style: none;

          a {
            color: $aled;
            text-transform: uppercase;
            font-weight: 900;
            //font-size: 1.15rem;
            font-kerning: none;

            span:not(.link) {
              opacity: 0;
              margin: 0 0.125rem;

              transition: opacity 0.2s ease-in-out;
            }

            span.link {
              margin-left: 0.25rem;
            }

            &:hover {
              span:not(.link) {
                opacity: 0.5;
              }
            }

            &.active {
              span:not(.link) {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
</style>
