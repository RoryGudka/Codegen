import { ESLint } from "eslint";

/**
 * Runs ESLint to get all lint errors across the codebase.
 */
export async function getAllLintErrors(): Promise<string> {
  try {
    const eslint = new ESLint();
    const results = await eslint.lintFiles(["**/*.ts"]);
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);

    return resultText || "No linting issues found.";
  } catch (error: any) {
    return `Error while running ESLint: ${error.message}`;
  }
}
