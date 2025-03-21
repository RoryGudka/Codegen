require("dotenv").config();

const fs = require("fs");
const path = require("path");

const readFileHandler = async ({ filePath }) => {
  const fullFilePath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullFilePath)) {
    return "File path does not exist. Try again with corrected file path.";
  }

  try {
    const fileContent = fs.readFileSync(fullFilePath, "utf8");
    return fileContent;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
};

module.exports = {
  readFileHandler,
};
