import fs from "fs";
import path from "path";

export function getContextFile(): string {
  const filePath = path.join(__dirname, ".codegen", "context.txt");

  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return "Context has not been initialized for this codebase yet.";
    } else {
      return `Error: An error occurred while reading the file: ${
        (error as Error).message
      }`;
    }
  }
}
