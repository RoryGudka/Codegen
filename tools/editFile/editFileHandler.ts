import fs from "fs";
import path from "path";
import { runEslintOnFile } from "../../helpers/runEslint";

interface EditFileParams {
  editFilePath: string;
  content: string;
}

const editFileHandler = async ({
  editFilePath,
  content,
}: EditFileParams): Promise<string> => {
  const fullPath = path.join(process.cwd(), editFilePath);

  if (!fs.existsSync(fullPath)) {
    return "File does not exist. Cannot edit non-existent file.";
  }

  try {
    fs.writeFileSync(fullPath, content, "utf8");
    return "File edited successfully.";
  } catch (error) {
    return `Failed to edit file: ${(error as Error).message}`;
  }
};

export { editFileHandler };
