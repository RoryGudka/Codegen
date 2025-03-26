import { exec } from "child_process";
import { findEslintConfig } from "./getEslintConfig";
import { resolve } from "path";

export async function runEslintOnFile(filePath: string): Promise<string> {
  const absoluteFilePath = resolve(filePath);
  const configDir = findEslintConfig(absoluteFilePath);
  const execOptions = configDir ? { cwd: configDir } : {};

  const hasEslintInstalled = await new Promise((res) => {
    setTimeout(() => res(false), 2000);
    exec(`npx eslint --v`, execOptions, (_, __, stderr) => {
      if (stderr) res(false);
      else res(true);
    });
  });
  if (!hasEslintInstalled) return "No instance of eslint found.";

  return new Promise((res) => {
    exec(
      `npx eslint "${absoluteFilePath}"`,
      execOptions,
      (_, stdout, stderr) => {
        if (stderr) {
          res(`ERROR: ${stderr}`);
        } else {
          res(stdout || "No linting issues found.");
        }
      }
    );
  });
}
