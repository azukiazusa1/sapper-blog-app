import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

const remarkVideo: Plugin = () => {
  return (tree) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "text", (node: any, index, parent) => {
      if (!node.value) return;
      
      // Match the pattern !v(url)
      const videoPattern = /!v\(([^)]+)\)/g;
      const matches = [...node.value.matchAll(videoPattern)];
      
      if (matches.length === 0) return;
      
      // If the text node contains only the video pattern, replace the entire node
      if (matches.length === 1 && node.value.trim() === matches[0][0]) {
        const url = matches[0][1];
        const html = `<video src="${url}" controls></video>`;
        
        node.type = "html";
        node.value = html;
        delete node.children;
        return;
      }
      
      // If there are multiple patterns or mixed content, split the text
      let newValue = node.value;
      for (const match of matches) {
        const url = match[1];
        const html = `<video src="${url}" controls></video>`;
        newValue = newValue.replace(match[0], html);
      }
      
      if (newValue !== node.value) {
        node.type = "html";
        node.value = newValue;
        delete node.children;
      }
    });
  };
};

export default remarkVideo;