import fs from "fs";
import path from "path";

interface DeleteFileParams {
  deleteFilePath: string;
}

const deleteFileHandler = async ({ deleteFilePath }: DeleteFileParams) => {
  const fullDeleteFilePath = path.join(process.cwd(), deleteFilePath);

  if (!fs.existsSync(fullDeleteFilePath)) {
    return "File path does not exist. Unable to delete non-existent file.";
  }

  try {
    fs.unlinkSync(fullDeleteFilePath);
    return "File deleted successfully.";
  } catch (error: any) {
    return `Failed to delete file. Error: ${error.message}`;
  }
};

export { deleteFileHandler };
