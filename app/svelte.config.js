import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: process.env.VERCEL
      ? adapter()
      : adapter({
          pages: "./.vercel/output/static",
        }),
    env: {
      dir: "../",
    },
  },
};

export default config;
