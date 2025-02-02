import Shiki from "@shikijs/markdown-it";

const mdItShiki = await Shiki({
  themes: {
    dark: "material-theme-darker",
    light: "material-theme-darker",
  },
});

export default ({ marp }) => marp.use(mdItShiki);
