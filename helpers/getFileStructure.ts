import fs from "fs";
import path from "path";
import ignore from "ignore";

export function getFileStructure(dir: string = "."): string {
  let result = "";

  try {
    // Load .gitignore patterns
    const gitignorePath = path.join(dir, ".gitignore");
    let ig = ignore();
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath).toString();
      ig = ig.add(gitignoreContent);
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
      if (file.startsWith(".") || file === "node_modules") continue;

      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      // Skip files and directories that are ignored by .gitignore
      const relativePath = path.relative(dir, filePath);
      if (ig.ignores(relativePath)) {
        continue;
      }

      if (stats.isDirectory()) {
        result += `📁 ${filePath}\n`;
        result += getFileStructure(filePath);
      } else {
        result += `📄 ${filePath}\n`;
      }
    }
  } catch (error) {
    console.error(`Error reading directory: ${error}`);
  }

  return result;
}
