import fs from "fs";
import path from "path";
import { runEslintOnFile } from "../../helpers/runEslint";

interface CreateFileParams {
  newFilePath: string;
  content: string;
}

const createFileHandler = async ({
  newFilePath,
  content,
}: CreateFileParams): Promise<string> => {
  const fullPath = path.join(process.cwd(), newFilePath);

  if (fs.existsSync(fullPath)) {
    return "File already exists. Cannot create duplicate file.";
  }

  try {
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, "utf8");

    // Run ESLint on the newly created file
    const lintingResult = await runEslintOnFile(fullPath);
    return `File created successfully.\nLinting result:\n${lintingResult}`;
  } catch (error) {
    return `Failed to create file: ${(error as Error).message}`;
  }
};

export { createFileHandler };
