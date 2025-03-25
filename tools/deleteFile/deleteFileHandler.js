const fs = require("fs");
const path = require("path");

const deleteFileHandler = async ({ deleteFilePath }) => {
  const fullDeleteFilePath = path.join(process.cwd(), deleteFilePath);

  if (!fs.existsSync(fullDeleteFilePath)) {
    return "File path does not exist. Unable to delete non-existent file.";
  }

  try {
    fs.unlinkSync(fullDeleteFilePath);
    return "File deleted successfully.";
  } catch (error) {
    return `Failed to delete file. Error: ${error.message}`;
  }
};

module.exports = {
  deleteFileHandler,
};
