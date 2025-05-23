import { exec } from "child_process";
import { findEslintConfig } from "./getEslintConfig";
import { resolve } from "path";

/**
 * Runs ESLint to get all lint errors across the codebase.
 */
export async function getAllLintErrors(): Promise<string> {
  const configDir = findEslintConfig(resolve("./eslint.config.mjs"));
  const execOptions = configDir ? { cwd: configDir } : {};

  const hasEslintInstalled = await new Promise((res) => {
    exec(`npx eslint --v`, execOptions, (_, __, stderr) => {
      if (stderr) res(false);
      else res(true);
    });
  });
  if (!hasEslintInstalled) return "No instance of eslint found.";

  return new Promise((res) => {
    exec(`npx eslint`, execOptions, (_, stdout, stderr) => {
      if (stderr) {
        res(`ERROR: ${stderr}`);
      } else {
        res(stdout || "No linting issues found.");
      }
    });
  });
}
