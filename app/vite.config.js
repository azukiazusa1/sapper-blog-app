import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      strategy: ["url", "preferredLanguage", "baseLocale"],
      disableAsyncLocalStorage: true,
    }),
    sveltekit(),
    tailwindcss(),
  ],
};

export default config;
