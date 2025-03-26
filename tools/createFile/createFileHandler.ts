import fs from "fs";
import path from "path";
import { runEslintOnFile } from "../../helpers/runEslintOnFile";
import { runPrettierOnFile } from "../../helpers/runPrettierOnFile";

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

  // Run Prettier on the newly created file
  const formattingResult = await runPrettierOnFile(fullNewFilePath);

  // Run ESLint on the newly created file
  const lintingResult = await runEslintOnFile(fullNewFilePath);

  return `File created successfully.\nFormatting result:\n${formattingResult}\nLinting result:\n${lintingResult}`;
};

export { createFileHandler };
