import fs from "fs";
import path from "path";
import { runEslintOnFile } from "../../helpers/runEslintOnFile";

interface CreateFileParams {
  newFilePath: string;
  content: string;
}

const createFileHandler = async ({
  newFilePath,
  content,
}: CreateFileParams): Promise<string> => {
  const fullNewFilePath = path.join(process.cwd(), newFilePath);

  // Check if file already exists
  if (fs.existsSync(fullNewFilePath)) {
    return "File already exists. Try again with editFile or corrected file path.";
  }

  // Create the directory if it doesn't exist
  const dir = path.dirname(fullNewFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullNewFilePath, content);

  // Run ESLint on the newly created file
  const lintingResult = await runEslintOnFile(fullNewFilePath);

  return `File created successfully.\nLinting result:\n${lintingResult}`;
};

export { createFileHandler };
