import adapter from "@sveltejs/adapter-cloudflare";
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

    sveltekit({
      compilerOptions: { runes: true },
      adapter: adapter({
        fallback: "spa",
        routes: { exclude: ["/*"] },
        paths: { relative: false },
      }),
      env: { dir: "../" },
      alias: { "$paraglide/*": "./src/paraglide/*" },
    }),
    tailwindcss(),
  ],
};

export default config;
