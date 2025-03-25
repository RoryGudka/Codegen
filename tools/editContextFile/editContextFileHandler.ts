import fs from "fs";
import path from "path";

interface EditContextFileParams {
  content: string;
}

const editContextFileHandler = async ({ content }: EditContextFileParams) => {
  const fullEditFilePath = path.join(process.cwd(), ".codegen/context.txt");

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

  return "Context file edited successfully";
};

export { editContextFileHandler };
