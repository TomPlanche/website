import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  kit: {
    adapter: adapter({
      out: "build",
    }),
  },
  preprocess: vitePreprocess(),
};

export default config;
