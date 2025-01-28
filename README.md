# My simple website.

## Stack
- [Svelte](https://svelte.dev/)
- [SvelteKit](https://kit.svelte.dev/)
- [Biome](https://biomejs.dev/)

## Cool things
- [Header Theme Switcher](./src/lib/components/Header.svelte)

    The changing button rotates on hover and fully rotates on click.
    The issue was that if the button hover was exited before the rotation was complete,the button would rotate back to its original positio, in a very jarring way.

- [Footer Link](./src/lib/components/Footer.svelte)

    The SVG external link icon was cool to tweak in order to animate it on hover.

- [Magnetik Component](./src/lib/components/Magnetik.svelte)

    A configurable magnetic field effect that attracts elements towards the mouse cursor. Features adjustable field size and force, with a debug mode that visualizes the magnetic field boundaries.

- [Custom Cursor](./src/lib/components/Cursor.svelte)

  A spring physics-based custom cursor that smoothly follows mouse movement. Fully customizable with support for
  scaling, opacity, blur effects, and the ability to display SVGs or text inside it on hover.
  Includes [its own actions](./src/lib/actions/cursor.ts) (`use:cursorEnter`
  and `use:cursorLeave`) for easily adding hover interactions to any element, with configurable parameters for
  scale, opacity, and content changes.
  It only appears on desktop devices and when the mouse has moved to avoid appearing on page load.

## Acknowledgements
### Fonts
- [iA Writer Duospace](https://github.com/iaolo/iA-Fonts)