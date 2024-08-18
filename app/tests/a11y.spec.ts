import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { createHtmlReport } from "axe-html-reporter";

const testPaths = [
  {
    path: "/",
    disableRules: [],
  },
  {
    path: "/blog",
    disableRules: [],
  },
  {
    path: "/blog/markdown-test",
    disableRules: ["label", "link-in-text-block"],
  },
  {
    path: "/about",
    disableRules: [],
  },
  {
    path: "/tags",
    disableRules: [],
  },
  {
    path: "/tags/graphql",
    disableRules: [],
  },
];

for (const { path, disableRules } of testPaths) {
  test(`a11y: ${path}`, async ({ page }) => {
    await page.goto(`http://localhost:3000${path}`);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(disableRules)
      .analyze();

    if (results.violations.length > 0) {
      createHtmlReport({
        results,
        options: {
          reportFileName: `${path.replace(/\//g, "-")}.html`,
        },
      });
    }

    expect(results.violations).toHaveLength(0);
  });

  test(`a11y: ${path} (dark)`, async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.goto(`http://localhost:3000${path}`);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(disableRules)
      .analyze();

    if (results.violations.length > 0) {
      createHtmlReport({
        results,
        options: {
          reportFileName: `${path.replace(/\//g, "-")}-dark.html`,
        },
      });
    }

    expect(results.violations).toHaveLength(0);
  });
}
