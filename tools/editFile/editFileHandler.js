const fs = require("fs");
const path = require("path");
const { runEslintOnFile } = require("../../helpers/runEslint");

const editFileHandler = async ({ editFilePath, content }) => {
  const fullEditFilePath = path.join(process.cwd(), editFilePath);

  if (!fs.existsSync(fullEditFilePath)) {
    return "File path does not exist. Try again with createFile or corrected file path.";
  }

  fs.writeFileSync(fullEditFilePath, content);

  // Run ESLint on the edited file
  const lintingResult = await runEslintOnFile(fullEditFilePath);

  return `File edited successfully.\nLinting result:\n${lintingResult}`;
};

module.exports = {
  editFileHandler,
};
