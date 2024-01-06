import adapter from "@sveltejs/adapter-vercel";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter({}),
    env: {
      dir: "../",
    },
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // ignore deliberate link to shiny 404 page
        if (
          path === "/pagefind/pagefind-ui.css" ||
          path === "/pagefind/pagefind-ui.js"
        ) {
          return;
        }

        // otherwise fail the build
        throw new Error(message);
      },
    },
  },
};

export default config;
