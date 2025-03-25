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

    // Run ESLint on renamed file if it's a JavaScript/TypeScript file
    if (newFilePath.match(/\.(js|ts)x?$/)) {
      const lintingResult = await runEslintOnFile(newFilePath);
      return `File renamed successfully.\nLinting result:\n${lintingResult}`;
    }

    return "File renamed successfully.";
  } catch (error) {
    return `Failed to rename file: ${(error as Error).message}`;
  }
};

export { renameFileHandler };
