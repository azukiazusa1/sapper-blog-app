import type { Image, Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const widths = [320, 480, 640, 768, 1024, 1280, 1600, 2048];
const contentfulHost = "images.ctfassets.net";

const optimizeUrl = (source: URL, width: number): string => {
  const url = new URL(source);
  url.searchParams.set("fm", "webp");
  url.searchParams.set("q", "60");
  url.searchParams.set("w", String(width));
  return url.toString();
};

const remarkContentfulImage: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "image", (node: Image) => {
      let source: URL;

      try {
        source = new URL(node.url);
      } catch {
        return;
      }

      if (source.hostname !== contentfulHost) {
        return;
      }

      node.url = optimizeUrl(source, 1024);
      node.data ??= {};
      node.data["hProperties"] = {
        loading: "lazy",
        decoding: "async",
        srcSet: widths
          .map((width) => `${optimizeUrl(source, width)} ${width}w`)
          .join(", "),
        sizes: "auto, (max-width: 1024px) 100vw, 1024px",
      };
    });
  };
};

export default remarkContentfulImage;
