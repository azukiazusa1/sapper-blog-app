import adapter from "@sveltejs/adapter-cloudflare";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    runes: true,
  },

  kit: {
    adapter: adapter({
      fallback: "spa",
      routes: {
        exclude: ["/*"],
      },
    }),
    env: {
      dir: "../",
    },
  },
};

export default config;
