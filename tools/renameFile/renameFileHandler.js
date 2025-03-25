const fs = require("fs");
const path = require("path");

const renameFileHandler = async ({ filePath, newFileName }) => {
  const fullFilePath = path.join(process.cwd(), filePath);
  const directoryPath = path.dirname(fullFilePath);
  const newFilePath = path.join(directoryPath, newFileName);

  if (!fs.existsSync(fullFilePath)) {
    return "File path does not exist. Cannot rename file.";
  }

  try {
    if (path.dirname(newFileName) !== ".") {
      throw new Error("Directory change detected. Operation not allowed.");
    }

    fs.renameSync(fullFilePath, newFilePath);
    return "File renamed successfully.";
  } catch (error) {
    return `Failed to rename file: ${error.message}`;
  }
};

module.exports = {
  renameFileHandler,
};