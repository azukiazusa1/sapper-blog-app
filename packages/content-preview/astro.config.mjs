import { defineConfig } from "astro/config";
// https://astro.build/config
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [tailwind(), react()],
  markdown: {
    shikiConfig: {
      theme: "nord",
    },
    remarkPlugins: [
      "remark-parse",
      "remark-link-card",
      "remark-gfm",
      "remark-hint",
      "remark-contentful-image",
      "remark-rehype",
    ],
    rehypePlugins: [
      "rehype-stringify",
      "rehype-code-titles",
      [
        "rehype-pretty-code",
        {
          theme: "material-darker",
        },
      ],
      "rehype-slug",
      "@jsdevtools/rehype-toc",
      "rehype-autolink-headings",
    ],
  },
  server: {
    port: 3333,
  },
});
