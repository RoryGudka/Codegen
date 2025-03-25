"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
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
exports.default = [config];
