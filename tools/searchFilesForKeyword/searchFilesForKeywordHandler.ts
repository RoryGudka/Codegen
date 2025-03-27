import fs from "fs";
import { getFileStructure } from "../../helpers/getFileStructure";
import path from "path";

interface SearchKeywordParams {
  keyword: string;
}

function searchFilesForKeyword(
  searchString: string,
  dirPath: string = "."
): string[] {
  let foundFiles: string[] = [];

  try {
    const items = getFileStructure().split("\n");

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      try {
        if (itemPath.includes(searchString)) {
          foundFiles.push(itemPath);
        } else {
          const fileContent = fs.readFileSync(itemPath, "utf8");
          if (fileContent.includes(searchString)) {
            foundFiles.push(itemPath);
          }
        }
      } catch (error: any) {
        console.error(`Error reading file ${itemPath}: ${error.message}`);
      }
    }
  } catch (error: any) {
    console.error(`Error processing directory ${dirPath}: ${error.message}`);
  }

  return foundFiles;
}

function searchFilesForKeywordHandler({
  keyword,
}: SearchKeywordParams): string {
  return searchFilesForKeyword(keyword, ".").join("\n");
}

export { searchFilesForKeywordHandler };
