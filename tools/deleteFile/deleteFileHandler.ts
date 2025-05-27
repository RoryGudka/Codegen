import fs from "fs";
import path from "path";

interface DeleteFileParams {
  deleteFilePath: string;
}

const deleteFileHandler = async ({ deleteFilePath }: DeleteFileParams) => {
  try {
    const fullDeleteFilePath = path.join(process.cwd(), deleteFilePath);

    if (!fs.existsSync(fullDeleteFilePath)) {
      return "File path does not exist. Unable to delete non-existent file.";
    }

    fs.unlinkSync(fullDeleteFilePath);
    return "File deleted successfully.";
  } catch (error: any) {
    return `Failed to delete file: ${error.message}`;
  }
};

export { deleteFileHandler };
