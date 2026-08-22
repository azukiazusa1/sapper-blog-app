import type { Plugin } from "unified";

const FAVICON_SIZE = 16;

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const getClassNames = (node: HastNode) => {
  const classNames = node.properties?.["className"];

  if (typeof classNames === "string") {
    return classNames.split(/\s+/).filter(Boolean);
  }

  if (Array.isArray(classNames)) {
    return classNames.filter(
      (candidate): candidate is string => typeof candidate === "string",
    );
  }

  return [];
};

const hasClassName = (node: HastNode, className: string) =>
  getClassNames(node).includes(className);

const addFavicon = (node: HastNode) => {
  if (node.type === "element" && node.tagName === "a") {
    if (hasClassName(node, "link-card")) {
      return;
    }

    const href = node.properties?.["href"];
    if (typeof href !== "string") {
      return;
    }

    let url: URL;
    try {
      url = new URL(href);
    } catch {
      // ページ内リンクと相対リンクには favicon を表示しない
      return;
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return;
    }

    const classNames = getClassNames(node);
    node.properties = {
      ...node.properties,
      className: [...classNames, "link-with-favicon"],
    };

    node.children?.unshift({
      type: "element",
      tagName: "img",
      properties: {
        className: ["link-favicon"],
        src: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url.hostname)}&sz=${FAVICON_SIZE * 2}`,
        width: FAVICON_SIZE,
        height: FAVICON_SIZE,
        alt: "",
        loading: "lazy",
        decoding: "async",
      },
      children: [],
    });
  }

  node.children?.forEach(addFavicon);
};

const rehypeLinkFavicon: Plugin = () => {
  return (tree) => {
    addFavicon(tree as HastNode);
  };
};

export default rehypeLinkFavicon;
