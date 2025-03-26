import fs from "fs";
import path from "path";
import { runEslintOnFile } from "../../helpers/runEslintOnFile";
import { runPrettierOnFile } from "../../helpers/runPrettierOnFile";

interface EditFileParams {
  editFilePath: string;
  content: string;
}

const editFileHandler = async ({
  editFilePath,
  content,
}: EditFileParams): Promise<string> => {
  const fullEditFilePath = path.join(process.cwd(), editFilePath);

  if (!fs.existsSync(fullEditFilePath)) {
    return "File path does not exist. Try again with createFile or corrected file path.";
  }

  fs.writeFileSync(fullEditFilePath, content);

  // Run Prettier on the edited file
  const formattingResult = await runPrettierOnFile(fullEditFilePath);

  // Run ESLint on the edited file
  const lintingResult = await runEslintOnFile(fullEditFilePath);

  return `File edited successfully.\nFormatting result:\n${formattingResult}\nLinting result:\n${lintingResult}`;
};

export { editFileHandler };
