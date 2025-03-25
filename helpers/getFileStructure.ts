import fs from "fs";
import ignore from "ignore";
import path from "path";

function getFileStructure(dirPath = ".", level = 0) {
  let result = "";
  const indent = "\t".repeat(level);

  try {
    // Load .gitignore patterns
    const gitignorePath = path.join(dirPath, ".gitignore");
    let ig = ignore();
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath).toString();
      ig = ig.add(gitignoreContent);
    }

    // Read the contents of the directory
    const items = fs.readdirSync(dirPath);

    // Sort items to list directories first, then files
    const sortedItems = items.sort((a, b) => {
      const aPath = path.join(dirPath, a);
      const bPath = path.join(dirPath, b);
      const aIsDir = fs.statSync(aPath).isDirectory();
      const bIsDir = fs.statSync(bPath).isDirectory();

      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

    // Process each item
    for (const item of sortedItems) {
      // Skip .git directories
      if (item === ".git") {
        continue;
      }

      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      // Skip files and directories that are ignored by .gitignore
      const relativePath = path.relative(dirPath, itemPath);
      if (ig.ignores(relativePath)) {
        continue;
      }

      // Add the current item to the result
      result += `${indent}${item}\n`;

      // If it's a directory, recursively process its contents
      if (stats.isDirectory()) {
        result += getFileStructure(itemPath, level + 1);
      }
    }

    return result;
  } catch (error) {
    console.error(`Error reading directory: ${error}`);
    return "";
  }
}

export { getFileStructure };
