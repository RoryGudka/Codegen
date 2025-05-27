import fs from "fs";
import path from "path";

interface RenameFileParams {
  filePath: string;
  newFileName: string;
}

const renameFileHandler = async ({
  filePath,
  newFileName,
}: RenameFileParams): Promise<string> => {
  try {
    const fullFilePath = path.join(process.cwd(), filePath);
    const directoryPath = path.dirname(fullFilePath);
    const newFilePath = path.join(directoryPath, newFileName);

    if (!fs.existsSync(fullFilePath)) {
      return "File path does not exist. Cannot rename file.";
    }

    if (path.dirname(newFileName) !== ".") {
      throw new Error("Directory change detected. Operation not allowed.");
    }

    fs.renameSync(fullFilePath, newFilePath);
    return "File renamed successfully.";
  } catch (e) {
    return `Failed to rename file: ${e}`;
  }
};

export { renameFileHandler };
