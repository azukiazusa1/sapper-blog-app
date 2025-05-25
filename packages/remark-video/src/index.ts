import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

const remarkVideo: Plugin = () => {
  return (tree) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "text", (node: any, index, parent) => {
      // Look for !v(url) pattern in text nodes
      const videoRegex = /!v\(([^)]+)\)/g;
      let match;
      const matches = [];
      
      while ((match = videoRegex.exec(node.value)) !== null) {
        matches.push({
          match: match[0],
          url: match[1],
          index: match.index,
        });
      }
      
      if (matches.length === 0) {
        return;
      }
      
      // Process matches in reverse order to maintain correct indices
      matches.reverse().forEach(({ match, url, index: matchIndex }) => {
        const beforeText = node.value.substring(0, matchIndex);
        const afterText = node.value.substring(matchIndex + match.length);
        
        // Create the video HTML
        const videoHtml = `<video src="${url}" controls></video>`;
        
        // Split the current node into parts
        const newNodes = [];
        
        if (beforeText) {
          newNodes.push({
            type: "text",
            value: beforeText,
          });
        }
        
        newNodes.push({
          type: "html",
          value: videoHtml,
        });
        
        if (afterText) {
          newNodes.push({
            type: "text",
            value: afterText,
          });
        }
        
        // Replace the current node with the new nodes
        if (parent && Array.isArray(parent.children) && typeof index === "number") {
          parent.children.splice(index, 1, ...newNodes);
        }
      });
    });
  };
};

export default remarkVideo;