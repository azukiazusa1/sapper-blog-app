import config from "eslint-config-custom";
import eslintPluginSvelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import tsEslint from "typescript-eslint";
import globals from "globals";

export default [
  ...eslintPluginSvelte.configs["flat/recommended"],
  ...config,
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsEslint.parser,
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsEslint.parser,
    },
  },
  {
    // デザインシステム: 未使用カラーパレットを禁止
    // @theme で無効化済みだが、classList.add() 等の動的クラスは
    // @theme では防げないため ESLint でも検出する
    files: ["**/*.svelte", "**/*.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/\\b(slate|gray|zinc|neutral|lime|teal|sky|fuchsia)-/]",
          message:
            "このカラーパレットは @theme で無効化されています。stone-* またはデザインシステムで許可されたカラーを使用してください（DESIGN.md Section 2 参照）。",
        },
      ],
    },
  },
  {
    ignores: [
      "playwright.config.ts",
      "src/generated/graphql.ts",
      "src/paraglide/**",
    ],
  },
];
