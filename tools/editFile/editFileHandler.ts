import fs from "fs";
import path from "path";
import { runEslintOnFile } from "../../helpers/runEslintOnFile";
import { runPrettierOnFile } from "../../helpers/runPrettierOnFile";

interface Edit {
  startLine: number;
  endLine: number;
  newContent: string;
  isInsertion?: boolean; // Optional, defaults to false
}

interface EditFileParams {
  editFilePath: string;
  edits: Edit[];
}

const editFileHandler = async ({
  editFilePath,
  edits,
}: EditFileParams): Promise<string> => {
  const fullEditFilePath = path.join(process.cwd(), editFilePath);

  if (!fs.existsSync(fullEditFilePath)) {
    return "File path does not exist. Try again with createFile or corrected file path.";
  }

  const fileContent = fs.readFileSync(fullEditFilePath, "utf8");
  const fileLines = fileContent.split("\n");

  // Sort edits in descending order to avoid line number shifts
  edits.sort((a, b) => b.startLine - a.startLine);

  for (const { startLine, endLine, newContent, isInsertion = false } of edits) {
    // Validate line numbers
    if (startLine < 1 || endLine < 1 || startLine > endLine) {
      return `Invalid line numbers: startLine=${startLine}, endLine=${endLine}. Lines must be positive and startLine <= endLine.`;
    }
    if (isInsertion && startLine !== endLine) {
      return `Invalid insertion: startLine=${startLine} must equal endLine=${endLine} for insertions.`;
    }
    if (startLine > fileLines.length + 1) {
      return `Invalid startLine=${startLine}: File has only ${fileLines.length} lines.`;
    }

    const newLines = newContent === "" ? [] : newContent.split("\n");

    if (isInsertion) {
      // Insert newContent before startLine
      const spliceStart = startLine - 1;
      fileLines.splice(spliceStart, 0, ...newLines);
    } else {
      // Replace lines from startLine to endLine (inclusive)
      const spliceStart = startLine - 1;
      const linesToRemove = endLine - startLine + 1;
      fileLines.splice(spliceStart, linesToRemove, ...newLines);
    }
  }

  // Write the updated content back to the file
  fs.writeFileSync(fullEditFilePath, fileLines.join("\n"));

  const formattingResult = await runPrettierOnFile(fullEditFilePath);
  const lintingResult = await runEslintOnFile(fullEditFilePath);

  return `File edited successfully.\nFormatting result:\n${formattingResult}\nLinting result:\n${lintingResult}`;
};

export { editFileHandler };
