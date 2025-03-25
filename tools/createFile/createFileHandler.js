const fs = require("fs");
const path = require("path");

const createFileHandler = async ({ newFilePath, content }) => {
  const fullNewFilePath = path.join(process.cwd(), newFilePath);

  // Check if file already exists
  if (fs.existsSync(fullNewFilePath)) {
    return "File already exists. Try again with editFile or corrected file path.";
  }

  // Create the directory if it doesn't exist
  const dir = path.dirname(fullNewFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullNewFilePath, content);

  return "File created successfully";
};

module.exports = {
  createFileHandler,
};
