import fs from "fs";
import path from "path";
import { runEslintOnFile } from "../../helpers/runEslint";

interface MoveFileParams {
  sourcePath: string;
  destinationPath: string;
}

const moveFileHandler = async ({
  sourcePath,
  destinationPath,
}: MoveFileParams): Promise<string> => {
  const fullSourcePath = path.join(process.cwd(), sourcePath);
  const fullDestinationPath = path.join(process.cwd(), destinationPath);

  if (!fs.existsSync(fullSourcePath)) {
    return "Source file does not exist. Cannot move non-existent file.";
  }

  try {
    const destDir = path.dirname(fullDestinationPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.renameSync(fullSourcePath, fullDestinationPath);

    // Run ESLint on the moved file if it's a JavaScript/TypeScript file
    if (fullDestinationPath.match(/\.(js|ts)x?$/)) {
      const lintingResult = await runEslintOnFile(fullDestinationPath);
      return `File moved successfully.\nLinting result:\n${lintingResult}`;
    }

    return "File moved successfully.";
  } catch (error) {
    return `Failed to move file: ${(error as Error).message}`;
  }
};

export { moveFileHandler };
