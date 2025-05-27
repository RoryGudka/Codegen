import fs from "fs";
import path from "path";

interface EditMemoryFileParams {
  content: string;
}

const editMemoryFileHandler = async ({ content }: EditMemoryFileParams) => {
  try {
    const fullEditFilePath = path.join(process.cwd(), ".codegen/memory.txt");

    // Create directory if it doesn't exist
    const dirPath = path.dirname(fullEditFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Create file with empty content if it doesn't exist
    if (!fs.existsSync(fullEditFilePath)) {
      fs.writeFileSync(fullEditFilePath, "");
    }

    fs.writeFileSync(fullEditFilePath, content);

    return "Memory edited successfully";
  } catch (e) {
    return `Failed to edit memory file: ${e}`;
  }
};

export { editMemoryFileHandler };
