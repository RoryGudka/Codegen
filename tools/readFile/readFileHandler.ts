import { ReadFileToolParameters } from "./readFileTool";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const readFileHandler = async ({
  filePath,
}: ReadFileToolParameters): Promise<string> => {
  const fullFilePath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullFilePath)) {
    return "File path does not exist. Try again with corrected file path.";
  }

  try {
    const fileContent = fs.readFileSync(fullFilePath, "utf8");
    return fileContent;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
};

export { readFileHandler };
