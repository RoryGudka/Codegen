import { exec } from "child_process";
import { resolve } from "path";

export async function runPrettierOnFile(filePath: string): Promise<string> {
  const absoluteFilePath = resolve(filePath);

  const hasPrettierInstalled = await new Promise((res) => {
    setTimeout(() => res(false), 2000);
    exec(`npx prettier --v`, (_, __, stderr) => {
      if (stderr) res(false);
      else res(true);
    });
  });
  if (!hasPrettierInstalled) return "No instance of Prettier found.";

  return new Promise((res) => {
    exec(`npx prettier --write "${absoluteFilePath}"`, (_, stdout, stderr) => {
      if (stderr) {
        res(`ERROR: ${stderr}`);
      } else {
        res(stdout || "Formatted successfully.");
      }
    });
  });
}
