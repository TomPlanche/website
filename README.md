# PORTFOLIO-2024

## TODO
- [x] Add a `inView` action.

  This action will be used to determine if an element is in view or not. It will dispatch a Node `CustomEvent`.

- [ ] Add content.
- [x] `Header` component.
  - [x] Use an `enum` in the global store to determine the current page.
  - [x] On each page, set the ` currentLink,` of the global store.
  - [x] Nice animation on hover of the links.
- [x] `SongPlaying` component.
  - [x] Use my `LastFMHandler` to get the current song playing.
  - [ ] Make it sticky to the footer but not taking any height on its parent.
