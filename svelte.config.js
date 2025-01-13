import adapter from "@sveltejs/adapter-static";
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';


const config = {
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      precompress: false,
      strict: true,
    }),
  },
  preprocess: vitePreprocess(),
};

export default config;
