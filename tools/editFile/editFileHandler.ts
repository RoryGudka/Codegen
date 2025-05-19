import { Line, patienceDiff } from "../../helpers/patienceDiff";

import fs from "fs";
import path from "path";
import { runEslintOnFile } from "../../helpers/runEslintOnFile";
import { runPrettierOnFile } from "../../helpers/runPrettierOnFile";

interface EditFileParams {
  editFilePath: string;
  update: string;
}

const applyUpdate = (fileContent: string, update: string): string => {
  const placeholderRegex = /^\s*{{\s*\.\.\.\s*}}\s*$/;
  const fileLines = fileContent.split("\n");
  const updateLines = update.split("\n");
  const diff = patienceDiff(fileLines, updateLines);
  const bLines = diff.lines.filter((line) => line.bIndex !== -1);
  const aLines = diff.lines.filter((line) => line.aIndex !== -1);

  const errors: number[] = [];
  bLines.forEach((line, i) => {
    if (placeholderRegex.test(line.line)) {
      if (i !== 0 && bLines[i - 1].aIndex === -1) {
        errors.push(line.bIndex);
      }
      if (i !== bLines.length - 1 && bLines[i + 1].aIndex === -1) {
        errors.push(line.bIndex);
      }
    }
  });

  if (errors.length) {
    throw new Error(
      `One or more context lines could not be resolved:\n\`\`\`\n${diff.lines
        .filter((line) => line.bIndex !== -1)
        .map((line, i) => `${errors.includes(i) ? "X" : " "}${line.line}`)
        .join("\n")}\n\`\`\``
    );
  }

  const content: Line[] = [];
  bLines.forEach((line, i) => {
    if (placeholderRegex.test(line.line)) {
      if (i === 0 && i === bLines.length - 1) {
        const start = 0;
        const end = aLines.length;
        content.push(...aLines.slice(start, end));
      } else if (i === 0) {
        const start = 0;
        const end = bLines[i + 1].aIndex;
        content.push(...aLines.slice(start, end));
      } else if (i === bLines.length - 1) {
        const start = bLines[i - 1].aIndex + 1;
        const end = aLines.length;
        content.push(...aLines.slice(start, end));
      } else {
        const start = bLines[i - 1].aIndex + 1;
        const end = bLines[i + 1].aIndex;
        content.push(...aLines.slice(start, end));
      }
    } else content.push(line);
  });

  return content.map((line) => line.line).join("\n");
};

const editFileHandler = async ({
  editFilePath,
  update,
}: EditFileParams): Promise<string> => {
  try {
    const fullEditFilePath = path.join(process.cwd(), editFilePath);

    if (!fs.existsSync(fullEditFilePath)) {
      return "File path does not exist. Try again with createFile or corrected file path.";
    }

    const fileContent = fs.readFileSync(fullEditFilePath, "utf8");
    const updatedContent = applyUpdate(fileContent, update);
    fs.writeFileSync(fullEditFilePath, updatedContent);

    const formattingResult = await runPrettierOnFile(fullEditFilePath);
    const lintingResult = await runEslintOnFile(fullEditFilePath);

    return `File edited successfully.\nFormatting result:\n${formattingResult}\nLinting result:\n${lintingResult}\n\nThis is the final file content. If this is not correct, edit the file again, rewriting the whole file without placeholders if necessary:\n\n${updatedContent}`;
  } catch (e: any) {
    console.error(e);
    return `Error: ${e.message}`;
  }
};

export { editFileHandler };
