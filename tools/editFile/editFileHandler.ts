import fs from "fs";
import path from "path";
import { runEslintOnFile } from "../../helpers/runEslintOnFile";
import { runPrettierOnFile } from "../../helpers/runPrettierOnFile";
import { patienceDiff, PatienceDiffResult } from "../../helpers/patienceDiff";

interface EditFileParams {
  editFilePath: string;
  update: string;
}

export const applyUpdate = (fileContent: string, update: string): string => {
  const placeholder = /^\s*{{\s*\.\.\.\s*}}\s*$/;
  const originalLines = fileContent.split("\n").map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));
  const updateLines = update.split("\n").map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));

  const diffResult = patienceDiff(originalLines, updateLines);
  const newContent: string[] = [];

  diffResult.lines.forEach(item => {
    // item.line: text of the line.
    // item.aIndex: index in originalLines (-1 if insert).
    // item.bIndex: index in updateLines (-1 if delete).

    if (item.bIndex !== -1) { // Line is from updateLines or common
      if (placeholder.test(updateLines[item.bIndex])) {
        // Placeholder in update: take original line
        // If item.aIndex is -1, it means the placeholder in updateLines didn't align with any original line.
        // This could happen if the placeholder is for a completely new section surrounded by new lines.
        // In such a case, we should probably insert the placeholder text itself, or reconsider the logic.
        // However, the prompt implies placeholders are for existing content.
        // If placeholder.test is true, and item.aIndex is NOT -1, it means an original line is preserved.
        if (item.aIndex !== -1) {
          newContent.push(originalLines[item.aIndex]);
        }
        // If item.aIndex IS -1 (placeholder in update corresponds to no original line),
        // we effectively drop/ignore this placeholder line from the update.
        // This interpretation aligns with "placeholders always map to original lines".
      } else {
        // Actual code from update: take update line
        newContent.push(updateLines[item.bIndex]);
      }
    }
    // Else (item.bIndex === -1): This line was only in originalLines (a deletion).
    // It's implicitly removed by not being added to newContent.
    // This correctly implements step 7. Else part of the "Final applyUpdate Strategy".
  });

  return newContent.join("\n");
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
