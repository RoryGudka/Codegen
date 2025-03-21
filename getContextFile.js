const fs = require("fs");
const path = require("path");

function getContextFile() {
  const filePath = path.join(__dirname, ".codegen", "context.txt");

  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      return "Context has not been initialized for this codebase yet.";
    } else {
      return `Error: An error occurred while reading the file: ${error.message}`;
    }
  }
}

module.exports = { getContextFile };
