import fs from "fs";
import path from "path";

export function getContextFile(): string {
  const contextFilePath = path.join(process.cwd(), ".codegen/context.txt");

  try {
    if (fs.existsSync(contextFilePath)) {
      return fs.readFileSync(contextFilePath, "utf8");
    }
  } catch (error) {
    console.error("Error reading context file:", error);
  }

  return "";
}
