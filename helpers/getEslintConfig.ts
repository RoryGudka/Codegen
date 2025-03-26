import { dirname, resolve } from "path";

import { readdirSync } from "fs";

export function findEslintConfig(filePath: string): string | null {
  let currentDir = resolve(dirname(filePath));

  while (currentDir !== "/") {
    try {
      const files = readdirSync(currentDir);

      // Check for any files starting with .eslintrc or .eslint.config
      const hasEslintConfig = files.some(
        (file) =>
          file.startsWith(".eslintrc") ||
          file.startsWith("eslint.config") ||
          (file === "package.json" &&
            hasEslintConfigInPackage(resolve(currentDir, file)))
      );

      if (hasEslintConfig) {
        return currentDir;
      }
    } catch (e) {
      // Handle case where we don't have permission to read directory
      console.error(`Error reading directory ${currentDir}: ${e}`);
    }

    // Move up one directory
    const parentDir = resolve(currentDir, "..");
    if (parentDir === currentDir) break; // Reached root
    currentDir = parentDir;
  }
  return null; // No config found, will use default ESLint config
}

// Helper function to check if package.json has eslintConfig
async function hasEslintConfigInPackage(packagePath: string): Promise<boolean> {
  try {
    const pkg = await import(packagePath);
    return !!pkg.eslintConfig;
  } catch (e) {
    return false;
  }
}
