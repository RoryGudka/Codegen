import fs from "fs";
import ignore from "ignore";
import path from "path";

interface SearchResult {
  file: string;
  matches: number;
  lines: string[];
}

interface SearchKeywordParams {
  keyword: string;
}

export function searchFilesForKeyword(
  searchString: string,
  dirPath: string = "."
): SearchResult[] {
  let foundFiles: SearchResult[] = [];

  try {
    // Load .gitignore patterns
    const gitignorePath = path.join(dirPath, ".gitignore");
    let ig = ignore();
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
      ig = ig.add(gitignoreContent);
    }

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      if (file.startsWith(".") || file === "node_modules") continue;

      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      // Skip files and directories that are ignored by .gitignore
      const relativePath = path.relative(dirPath, filePath);
      if (ig.ignores(relativePath)) continue;

      if (stats.isDirectory()) {
        foundFiles = foundFiles.concat(
          searchFilesForKeyword(searchString, filePath)
        );
      } else {
        const content = fs.readFileSync(filePath, "utf8");
        const lines = content.split("\n");
        const matchingLines = lines.filter((line) =>
          line.toLowerCase().includes(searchString.toLowerCase())
        );

        if (matchingLines.length > 0) {
          foundFiles.push({
            file: filePath,
            matches: matchingLines.length,
            lines: matchingLines,
          });
        }
      }
    }
  } catch (error) {
    console.error(
      `Error processing directory ${dirPath}: ${(error as Error).message}`
    );
  }

  return foundFiles;
}

export function searchFilesForKeywordHandler({
  keyword,
}: SearchKeywordParams): SearchResult[] {
  return searchFilesForKeyword(keyword, ".");
}

module.exports = {
  searchFilesForKeywordHandler,
};
