import fs from "fs";
import ignore from "ignore";
import path from "path";

function findGitignore(dirPath: string): string | null {
  let currentDir = path.resolve(dirPath);

  while (currentDir !== "/") {
    const gitignorePath = path.join(currentDir, ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      return currentDir;
    }

    // Move up one directory
    const parentDir = path.resolve(currentDir, "..");
    if (parentDir === currentDir) break; // Reached root
    currentDir = parentDir;
  }
  return null; // No .gitignore found
}

function getFileStructure(dirPath = ".") {
  const absoluteDirPath = path.resolve(dirPath);
  const gitignoreDir = findGitignore(absoluteDirPath);

  let ig = ignore();
  if (gitignoreDir) {
    const gitignorePath = path.join(gitignoreDir, ".gitignore");
    const gitignoreContent = fs.readFileSync(gitignorePath).toString();
    ig = ig.add(gitignoreContent);
  }

  const isIgnored = (filePath: string) => {
    // Use the directory containing .gitignore as the base for relative paths
    const baseDir = gitignoreDir || absoluteDirPath;
    const relativePath = path.relative(baseDir, filePath);
    return relativePath && ig.ignores(relativePath);
  };

  function scanDir(currentPath: string) {
    let files: string[] = [];
    try {
      const items = fs.readdirSync(currentPath);
      for (const item of items) {
        if (item !== ".git" && item !== "package-lock.json") {
          const fullPath = path.join(currentPath, item);
          if (!fullPath.includes(".codegen")) {
            if (isIgnored(fullPath)) continue;
            if (fs.statSync(fullPath).isDirectory()) {
              files = files.concat(scanDir(fullPath));
            } else {
              files.push(path.relative(process.cwd(), fullPath)); // Convert to relative path
            }
          }
        }
      }
    } catch (e) {
      console.error(`Error reading directory ${currentPath}: ${e}`);
    }
    return files;
  }

  return scanDir(absoluteDirPath).join("\n");
}

export { getFileStructure };
