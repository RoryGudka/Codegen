require("dotenv").config();

const fs = require("fs");
const path = require("path");

const readFileHandler = async ({ filePath }) => {
  const fullFilePath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullFilePath)) {
    return "File path does not exist. Try again with corrected file path.";
  }

  return fs.readFileSync(fullFilePath, "utf8");
};

module.exports = {
  readFileHandler,
};
