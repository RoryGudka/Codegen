const fs = require("fs");
const path = require("path");

const editFileHandler = async ({ editFilePath, content }) => {
  const fullEditFilePath = path.join(process.cwd(), editFilePath);

  if (!fs.existsSync(fullEditFilePath)) {
    return "File path does not exist. Try again with createFile orcorrected file path.";
  }

  fs.writeFileSync(fullEditFilePath, content);

  return "File edited successfully";
};

module.exports = {
  editFileHandler,
};
