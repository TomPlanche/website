import adapter from "@sveltejs/adapter-static";
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';


/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // default options are shown
      pages: "build",
      assets: "build",
      fallback: false,
      precompress: false,
      strict: true,
    }),

  },
  preprocess: vitePreprocess(),
};

export default config;
