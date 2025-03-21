import fs from "fs";
import ignore from "ignore";
import path from "path";

export function getFileStructure(): string {
  const ig = ignore();

  // Read .gitignore if it exists
  try {
    const gitignore = fs.readFileSync(".gitignore", "utf8");
    ig.add(gitignore);
  } catch (error) {
    // No .gitignore file, that's fine
  }

  function walkDir(dir: string, indent: string = ""): string {
    let structure = "";
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(process.cwd(), fullPath);

      // Skip if file/directory is ignored by .gitignore
      if (ig.ignores(relativePath)) {
        continue;
      }

      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        structure += `${indent}${file}/\n`;
        structure += walkDir(fullPath, indent + "  ");
      } else {
        structure += `${indent}${file}\n`;
      }
    }

    return structure;
  }

  return walkDir(".");
}
