import * as fs from "fs";
import * as path from "path";

function getCurrentDirectoryFileStructure(dirPath: string = __dirname): object {
  const fileStructure = {};

  function readDirectory(currentPath: string): object {
    const structure = {};
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      const itemPath = path.join(currentPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        structure[item] = readDirectory(itemPath);
      } else {
        structure[item] = "file";
      }
    });

    return structure;
  }

  fileStructure["directory"] = readDirectory(dirPath);
  return fileStructure;
}

console.log(getCurrentDirectoryFileStructure());
