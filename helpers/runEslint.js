const { ESLint } = require("eslint");

async function runEslintOnFile(filePath) {
  const eslint = new ESLint();
  const results = await eslint.lintFiles([filePath]);
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  return resultText || "No linting issues found.";
}

module.exports = { runEslintOnFile };
