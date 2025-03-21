const fs = require("fs");
const path = require("path");

function getFileStructure(dirPath = ".", level = 0) {
  let result = "";
  const indent = "\t".repeat(level);

  try {
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
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

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

module.exports = {
  getFileStructure,
};
