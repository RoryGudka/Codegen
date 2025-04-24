import fs from "fs";
import path from "path";

interface ListDirParams {
  relativeWorkspacePath: string;
}

const listDirHandler = async ({
  relativeWorkspacePath,
}: ListDirParams): Promise<string> => {
  const fullPath = path.join(process.cwd(), relativeWorkspacePath);

  if (!fs.existsSync(fullPath)) {
    return "Directory does not exist.";
  }

  try {
    const files = fs.readdirSync(fullPath);
    return files.join("\n");
  } catch (error: any) {
    return `Failed to list directory contents. Error: ${error.message}`;
  }
};

export { listDirHandler };
