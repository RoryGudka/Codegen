const fs = require("fs");
const path = require("path");

const moveFileHandler = async ({ sourcePath, destinationPath }) => {
  const fullSourcePath = path.join(process.cwd(), sourcePath);
  const fullDestinationPath = path.join(process.cwd(), destinationPath);

  if (!fs.existsSync(fullSourcePath)) {
    return "Source file path does not exist. Cannot move file.";
  }

  try {
    // Create the destination directory recursively if it doesn't exist
    const destinationDir = path.dirname(fullDestinationPath);
    fs.mkdirSync(destinationDir, { recursive: true });

    fs.renameSync(fullSourcePath, fullDestinationPath);
    return "File moved successfully";
  } catch (error) {
    return `Failed to move file: ${error.message}`;
  }
};

module.exports = {
  moveFileHandler,
};