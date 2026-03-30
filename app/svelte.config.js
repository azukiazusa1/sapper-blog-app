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
      paths: {
        relative: false,
      },
    }),
    env: {
      dir: "../",
    },
    alias: {
      "$paraglide/*": "./src/paraglide/*",
    },
  },
};

export default config;
