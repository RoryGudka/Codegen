const fs = require("fs");
const path = require("path");

const editContextFileHandler = async ({ content }) => {
  const fullEditFilePath = path.join(process.cwd(), ".codegen/context.txt");

  // Create directory if it doesn't exist
  const dirPath = path.dirname(fullEditFilePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Create file with empty content if it doesn't exist
  if (!fs.existsSync(fullEditFilePath)) {
    fs.writeFileSync(fullEditFilePath, "");
  }

  fs.writeFileSync(fullEditFilePath, content);

  const contextFileContent = fs.readFileSync(fullEditFilePath, "utf8");

  return "Context file edited successfully";
};

module.exports = {
  editContextFileHandler,
};
