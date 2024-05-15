import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const h = (type: string, attrs = {}, children: any[] = []) => {
  return {
    type: "element",
    tagName: type,
    data: {
      hName: type,
      hProperties: attrs,
      hChildren: children,
    },
    properties: attrs,
    children,
  };
};

const text = (value = "") => {
  return {
    type: "text",
    value,
  };
};

const rehypeAlert: Plugin = () => {
  return (tree) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "element", (node: any, index) => {
      if (node.tagName !== "p") return;
      if (node.children === undefined || node.children.length === 0) return;
      const [{ type, value }, ...siblings] = node.children;
      if (type !== "text") return;

      if (value.startsWith("x>")) {
        node.children = [
          h("div", { className: "alert alert-error" }, [
            h("p", { className: "alert-title" }, [
              h(
                "svg",
                {
                  className: "alert-icon",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  strokeWidth: "1.5",
                  stroke: "currentColor",
                },
                [
                  h("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
                  }),
                ],
              ),
              h("text", {}, [text("Caution")]),
            ]),
            h("p", { className: "alert-content" }, [
              text(value.slice(2).trimStart()),
              ...siblings,
            ]),
          ]),
        ];

        // @ts-expect-error tree に children はある
        tree.children.splice(index, 1, ...node.children);
      }

      if (value.startsWith("!>")) {
        node.children = [
          h("div", { className: "alert alert-note" }, [
            h("p", { className: "alert-title" }, [
              h(
                "svg",
                {
                  className: "alert-icon",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  strokeWidth: "1.5",
                  stroke: "currentColor",
                },
                [
                  h("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z",
                  }),
                ],
              ),
              h("text", {}, [text("Note")]),
            ]),
            h("p", { className: "alert-content" }, [
              text(value.slice(2).trimStart()),
              ...siblings,
            ]),
          ]),
        ];

        // @ts-expect-error tree に children はある
        tree.children.splice(index, 1, ...node.children);
      }

      if (value.startsWith("->")) {
        node.children = [
          h("div", { className: "alert alert-tip" }, [
            h("p", { className: "alert-title" }, [
              h(
                "svg",
                {
                  className: "alert-icon",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  strokeWidth: "1.5",
                  stroke: "currentColor",
                },
                [
                  h("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
                  }),
                ],
              ),
              h("text", {}, [text("Tip")]),
            ]),
            h("p", { className: "alert-content" }, [
              text(value.slice(2).trimStart()),
              ...siblings,
            ]),
          ]),
        ];

        // @ts-expect-error tree に children はある
        tree.children.splice(index, 1, ...node.children);
      }

      if (value.startsWith("?>")) {
        node.children = [
          h("div", { className: "alert alert-warning" }, [
            h("p", { className: "alert-title" }, [
              h(
                "svg",
                {
                  className: "alert-icon",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  strokeWidth: "1.5",
                  stroke: "currentColor",
                },
                [
                  h("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z",
                  }),
                ],
              ),
              h("text", {}, [text("Warning")]),
            ]),
            h("p", { className: "alert-content" }, [
              text(value.slice(2).trimStart()),
              ...siblings,
            ]),
          ]),
        ];
        // @ts-expect-error tree に children はある
        tree.children.splice(index, 1, ...node.children);
      }
    });
  };
};

export default rehypeAlert;
