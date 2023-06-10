import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

const remarkContentfulImage: Plugin = () => {
  return (tree) => {
    visit(tree, "image", (node: any) => {
      let srcset = "";
      if (node.url && node.url.includes("images.ctfassets.net")) {
        node.url = node.url + "?q=50&fm=webp";
        srcset = `${node.url}&w=100 100w,
        ${node.url}&w=200 200w,
        ${node.url}&w=300 300w,
        ${node.url}&w=400 400w,
        ${node.url}&w=500 500w,
        ${node.url}&w=600 600w,
        ${node.url}&w=700 700w,
        ${node.url}&w=800 800w,
        ${node.url}&w=900 900w,
        ${node.url}&w=1000 1000w,
        ${node.url}&w=1100 1100w,
        ${node.url}&w=1200 1200w`;
      }
      const html = `<img src="${node.url}" alt="${node.alt}" loading="lazy" ${
        srcset
          ? `srcset="${srcset}" sizes="(max-width: 1024px) 100vw, 1024px"`
          : ""
      } />`;
      node.type = "html"; // this breaks the node type, so always use this plug in at last
      node.children = undefined;
      node.value = html;
    });
  };
};

export default remarkContentfulImage;
