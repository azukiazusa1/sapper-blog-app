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
    ignores: ["playwright.config.ts", "src/generated/graphql.ts"],
  },
];
