import { ESLint } from "eslint";
import path from "path";

/**
 * Runs ESLint to get all lint errors across the codebase.
 */
export async function getAllLintErrors(): Promise<string> {
  try {
    const eslint = new ESLint({
      overrideConfigFile: path.resolve(__dirname, "../eslint.config.js")
    });
    const results = await eslint.lintFiles(["**/*.ts"]);
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results, {
      cwd: process.cwd(),
      rulesMeta: {},
    });

    return resultText || "No linting issues found.";
  } catch (error) {
    return `Error while running ESLint: ${error.message}`;
  }
}
