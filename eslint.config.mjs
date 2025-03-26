import globals from "globals";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import typescriptEslint from "@typescript-eslint/eslint-plugin";

export default [
  {
    // Files to lint
    files: ["**/*.ts", "**/*.tsx"],

    // Language options
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },

    // Plugins
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    // Rules
    rules: {
      // Base JavaScript rules
      ...js.configs.recommended.rules,

      // TypeScript specific rules
      ...typescriptEslint.configs.recommended.rules,

      // Common rules
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
      eqeqeq: ["error", "always"],
    },
  },
  {
    // Ignore patterns
    ignores: ["node_modules/**", "dist/**", "build/**", "*.min.js"],
  },
];
