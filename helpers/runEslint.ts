import { ESLint } from "eslint";

export async function runEslintOnFile(filePath: string): Promise<string> {
  const eslint = new ESLint();
  const results = await eslint.lintFiles([filePath]);
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  return resultText || "No linting issues found.";
}
