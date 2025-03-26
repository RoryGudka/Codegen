import fs from "fs";
import ignore from "ignore";
import path from "path";

function getFileStructure(dirPath = ".") {
  const gitignorePath = path.join(dirPath, ".gitignore");
  let ig = ignore();
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath).toString();
    ig = ig.add(gitignoreContent);
  }

  const isIgnored = (filePath: string) => {
    const relativePath = path.relative(dirPath, filePath);
    return ig.ignores(relativePath);
  };

  function scanDir(currentPath: string) {
    let files: string[] = [];
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      if (item !== ".git" && item !== "package-lock.json") {
        const fullPath = path.join(currentPath, item);
        if (isIgnored(fullPath)) continue;
        if (fs.statSync(fullPath).isDirectory()) {
          files = files.concat(scanDir(fullPath));
        } else {
          files.push(fullPath);
        }
      }
    }
    return files;
  }

  return scanDir(dirPath).join("\n");
}

export { getFileStructure };
