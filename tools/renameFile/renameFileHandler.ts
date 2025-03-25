import { FileOperationResult } from "../../types";
import fs from "fs";
import path from "path";
import { runEslintOnFile } from "../../helpers/runEslint";

interface RenameFileParams {
  filePath: string;
  newFileName: string;
}

const renameFileHandler = async ({
  filePath,
  newFileName,
}: RenameFileParams): Promise<string> => {
  const fullFilePath = path.join(process.cwd(), filePath);
  const directoryPath = path.dirname(fullFilePath);
  const newFilePath = path.join(directoryPath, newFileName);

  if (!fs.existsSync(fullFilePath)) {
    return "File path does not exist. Cannot rename file.";
  }

  try {
    if (path.dirname(newFileName) !== ".") {
      throw new Error("Directory change detected. Operation not allowed.");
    }

    fs.renameSync(fullFilePath, newFilePath);
    return "File renamed successfully.";
  } catch (error: any) {
    return `Failed to rename file: ${error.message}`;
  }
};

export { renameFileHandler };
