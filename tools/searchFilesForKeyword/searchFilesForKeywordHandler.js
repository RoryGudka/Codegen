const fs = require("fs");
const path = require("path");
const ignore = require("ignore");

function searchFilesForKeyword(searchString, dirPath = ".") {
  let foundFiles = [];

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

    for (const item of sortedItems) {
      if (item === ".git") {
        continue;
      }

      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      const relativePath = path.relative(dirPath, itemPath);
      if (ig.ignores(relativePath)) {
        continue;
      }

      if (stats.isDirectory()) {
        foundFiles = foundFiles.concat(
          searchFilesForKeyword(searchString, itemPath)
        );
      } else {
        try {
          if (itemPath.includes(searchString)) {
            foundFiles.push(itemPath);
          } else {
            const fileContent = fs.readFileSync(itemPath, "utf8");
            if (fileContent.includes(searchString)) {
              foundFiles.push(itemPath);
            }
          }
        } catch (error) {
          console.error(`Error reading file ${itemPath}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}: ${error.message}`);
  }

  return foundFiles;
}

function searchFilesForKeywordHandler({ keyword }) {
  return searchFilesForKeyword(keyword, ".");
}

module.exports = {
  searchFilesForKeywordHandler,
};
