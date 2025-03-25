import { Linter } from "eslint";

const config: Linter.FlatConfig = {
  files: ["**/*.{js,ts,jsx,tsx}"], // Include JSX and TSX files for linting
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true }, // Enable JSX parsing
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
