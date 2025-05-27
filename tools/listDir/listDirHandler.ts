import fs from "fs";
import path from "path";

interface ListDirParams {
  relativeWorkspacePath: string;
}

const listDirHandler = async ({
  relativeWorkspacePath,
}: ListDirParams): Promise<string> => {
  try {
    const fullPath = path.join(process.cwd(), relativeWorkspacePath);

    if (!fs.existsSync(fullPath)) {
      return "Directory does not exist.";
    }

    const files = fs.readdirSync(fullPath);
    return files.join("\n");
  } catch (e) {
    return `Failed to list directory contents: ${e}`;
  }
};

export { listDirHandler };
