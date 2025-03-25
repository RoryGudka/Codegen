import { Linter } from "eslint";

const config: Linter.FlatConfig = {
  files: ["**/*.{js,ts}"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      window: "readonly",
      document: "readonly",
      console: "readonly",
    },
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
  },
};

export default [config];
