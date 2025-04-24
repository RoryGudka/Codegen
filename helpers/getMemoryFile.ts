import fs from "fs";
import path from "path";

export function getMemoryFile(): string {
  const filePath = path.join(__dirname, ".codegen", "memory.txt");

  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return "No memories stored yet";
    } else {
      return `Error: An error occurred while reading the file: ${error.message}`;
    }
  }
}
