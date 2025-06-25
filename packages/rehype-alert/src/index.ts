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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleNewSyntax = (tree: any) => {
  const children = tree.children;
  if (!children) return;

  for (let i = 0; i < children.length; i++) {
    const node = children[i];

    // Look for paragraph nodes that contain the new syntax
    if (node.tagName === "p" && node.children && node.children.length > 0) {
      // First, check if the paragraph starts with :::type
      const firstChild = node.children[0];
      if (firstChild.type === "text" && firstChild.value) {
        const match = firstChild.value.match(
          /^:::(note|alert|tip|warning)\s*\n([\s\S]*?)\n:::$/,
        );
        if (match) {
          const alertType = match[1];
          const content = match[2];

          // Create content nodes from the inner text - preserve line breaks as separate paragraphs
          const lines = content
            .split("\n")
            .filter((line: string) => line.trim() !== "");
          const contentNodes = lines.map((line: string) =>
            h("p", {}, [text(line)]),
          );

          // Create the alert element
          const alertElement = createAlertElement(alertType, contentNodes);

          if (alertElement) {
            // Replace the current node with the alert element
            children[i] = alertElement;
          }
        } else {
          // Handle case where we need to extract content from mixed node children
          // This handles markdown processing like **bold** and *italic*
          const nodeText = reconstructTextFromChildren(node.children);
          const blockMatch = nodeText.match(
            /^:::(note|alert|tip|warning)\s*\n([\s\S]*?)\n:::$/,
          );
          if (blockMatch && blockMatch[1]) {
            const alertType: string = blockMatch[1];

            // Extract content nodes between the delimiters
            const contentNodes = extractContentNodes(node.children);

            // Create the alert element
            const alertElement = createAlertElement(alertType, contentNodes);

            if (alertElement) {
              // Replace the current node with the alert element
              children[i] = alertElement;
            }
          }
        }
      }
    }
  }
};

// Helper function to reconstruct text from mixed children (text + elements)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reconstructTextFromChildren = (children: any[]): string => {
  return (
    children
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((child: any) => {
        if (child.type === "text") {
          return child.value;
        } else if (child.type === "element") {
          // For simple elements like <strong> or <em>, extract their text content
          return reconstructTextFromChildren(child.children || []);
        }
        return "";
      })
      .join("")
  );
};

// Helper function to extract content nodes between :::type and :::
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractContentNodes = (children: any[]): any[] => {
  const allText = reconstructTextFromChildren(children);
  const match = allText.match(
    /^:::(note|alert|tip|warning)\s*\n([\s\S]*?)\n:::$/,
  );

  if (!match || !match[2]) return [];

  const contentText: string = match[2];

  // Find the content portion in the original children
  // This is a simplified approach - we'll reconstruct from the middle content
  const lines = contentText
    .split("\n")
    .filter((line: string) => line.trim() !== "");

  // For now, create simple paragraph nodes
  // TODO: This could be improved to preserve the original HTML structure better
  return lines.map((line: string) => h("p", {}, [text(line)]));
};

// Type mapping for alert configurations
const ALERT_TYPE_MAPPING = {
  note: {
    className: "alert-note",
    title: "Note",
    icon: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z",
  },
  alert: {
    className: "alert-error",
    title: "Caution",
    icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
  },
  tip: {
    className: "alert-tip",
    title: "Tip",
    icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  },
  warning: {
    className: "alert-warning",
    title: "Warning",
    icon: "M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z",
  },
  // Map legacy prefixes to alert types
  "x>": {
    className: "alert-error",
    title: "Caution",
    icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
  },
  "!>": {
    className: "alert-note",
    title: "Note",
    icon: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z",
  },
  "->": {
    className: "alert-tip",
    title: "Tip",
    icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  },
  "?>": {
    className: "alert-warning",
    title: "Warning",
    icon: "M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z",
  },
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createAlertElement = (alertType: string, contentNodes: any[]) => {
  const config =
    ALERT_TYPE_MAPPING[alertType as keyof typeof ALERT_TYPE_MAPPING];
  if (!config) return null;

  return h("div", { className: `alert ${config.className}` }, [
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
            d: config.icon,
          }),
        ],
      ),
      h("text", {}, [text(config.title)]),
    ]),
    h("div", { className: "alert-content" }, contentNodes),
  ]);
};

const rehypeAlert: Plugin = () => {
  return (tree) => {
    // Handle new :::type syntax first
    handleNewSyntax(tree);

    // Handle legacy syntax
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "element", (node: any, index) => {
      if (node.tagName !== "p") return;
      if (node.children === undefined || node.children.length === 0) return;
      const [{ type, value }, ...siblings] = node.children;
      if (type !== "text") return;

      // Handle baseline-status separately as it's not an alert
      if (value.startsWith("b>")) {
        node.children = [
          h(
            "baseline-status",
            {
              featureId: value.slice(2).trimStart(),
            },
            [],
          ),
        ];
        // @ts-expect-error tree に children はある
        tree.children.splice(index, 1, ...node.children);
        return;
      }

      // Handle alert types using unified createAlertElement function
      for (const prefix of ["x>", "!>", "->", "?>"]) {
        if (value.startsWith(prefix)) {
          const contentNodes = [
            h("p", {}, [text(value.slice(2).trimStart()), ...siblings]),
          ];

          const alertElement = createAlertElement(prefix, contentNodes);
          if (alertElement) {
            node.children = [alertElement];
            // @ts-expect-error tree に children はある
            tree.children.splice(index, 1, ...node.children);
          }
          return;
        }
      }
    });
  };
};

export default rehypeAlert;
