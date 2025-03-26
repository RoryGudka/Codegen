import fs from "fs";
import path from "path";

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
    return "Source file path does not exist. Cannot move file.";
  }

  try {
    // Create the destination directory recursively if it doesn't exist
    const destinationDir = path.dirname(fullDestinationPath);
    fs.mkdirSync(destinationDir, { recursive: true });

    fs.renameSync(fullSourcePath, fullDestinationPath);
    return "File moved successfully";
  } catch (error: any) {
    return `Failed to move file: ${error.message}`;
  }
};

export { moveFileHandler };
