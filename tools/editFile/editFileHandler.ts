import fs from "fs";
import path from "path";
import { runEslintOnFile } from "../../helpers/runEslintOnFile";
import { runPrettierOnFile } from "../../helpers/runPrettierOnFile";

interface Section {
  start: number;
  end: number;
  verifyStart: boolean;
  verifyEnd: boolean;
}

const getSections = (update: string): Section[] => {
  const placeholderRegex = /^\s*{{\s*\.\.\.\s*}}\s*$/;
  const lines = update
    .split("\n")
    .map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));

  const indexes: number[] = [];
  lines.forEach((line, i) => {
    if (placeholderRegex.test(line)) indexes.push(i);
  });

  // Edge case: only code
  if (indexes.length === 0) {
    return [
      {
        start: 0,
        end: lines.length - 1,
        verifyStart: false,
        verifyEnd: false,
      },
    ];
  }

  // Edge case: only placeholder
  if (lines.length === 1 && indexes.length === 1) {
    return [];
  }

  const sections: Section[] = [];
  indexes.forEach((index, i) => {
    const verifyStart = i !== 0 || index === 0;
    const verifyEnd = i !== indexes.length - 1 || index === lines.length - 1;
    const next = i === indexes.length - 1 ? lines.length : indexes[i + 1];

    if (!verifyStart) {
      sections.push({
        start: 0,
        end: index - 1,
        verifyStart,
        verifyEnd,
      });
      if (i !== indexes.length - 1) {
        sections.push({
          start: index + 1,
          end: next - 1,
          verifyStart: true,
          verifyEnd: true,
        });
      }
    } else if (!verifyEnd) {
      sections.push({
        start: index + 1,
        end: next - 1,
        verifyStart,
        verifyEnd,
      });
    } else if (i !== indexes.length - 1) {
      sections.push({
        start: index + 1,
        end: next - 1,
        verifyStart,
        verifyEnd,
      });
    }
  });

  return sections;
};

interface EditFileParams {
  editFilePath: string;
  update: string;
}

export const applyUpdate = (fileContent: string, update: string): string => {
  const fileLines = fileContent
    .split("\n")
    .map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));
  const updateLines = update
    .split("\n")
    .map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));
  const file = fileLines.join("\n") + "\n";

  const sections = getSections(update);
  if (sections.length === 0) return fileContent;

  console.log(sections);

  const errors: number[] = [];
  let content = "";
  let lastEndIndex = -1;
  sections.map((section, k) => {
    let startIndex = -1;
    let endIndex = -1;
    if (section.verifyStart) {
      for (let i = section.end + 1; i >= section.start; i--) {
        const content = updateLines.slice(section.start, i).join("\n") + "\n";
        const index = file.indexOf(content);
        if (index !== -1) {
          const substring = file.substring(index + content.length);
          if (substring.indexOf(content) !== -1) {
            const indexes = Array.from(Array(i - section.start).keys());
            console.log(indexes);
            const offset = indexes.map((j) => j + section.start);
            console.log(offset);
            errors.push(...offset);
          } else {
            startIndex = index;
          }
          break;
        }
      }
      if (startIndex === -1) {
        errors.push(section.start);
      }
    }
    if (section.verifyEnd) {
      for (let i = section.start; i < section.end + 1; i++) {
        const content = updateLines.slice(i, section.end + 1).join("\n") + "\n";
        const index = file.indexOf(content);
        if (index !== -1) {
          const substring = file.substring(index + content.length);
          if (substring.indexOf(content) !== -1) {
            const indexes = Array.from(Array(section.end + 1 - i).keys());
            console.log(indexes);
            const offset = indexes.map((j) => j + i);
            console.log(offset);
            errors.push(...offset);
          } else {
            endIndex = index + content.length;
          }
          break;
        }
      }
      if (startIndex === -1) {
        errors.push(section.end);
      }
    }

    if (startIndex !== -1 && lastEndIndex !== -1) {
      content += file.substring(lastEndIndex, startIndex);
    } else if (startIndex !== -1 && lastEndIndex === -1) {
      content += file.substring(0, startIndex);
    }
    content +=
      updateLines.slice(section.start, section.end + 1).join("\n") + "\n";
    if (k === sections.length - 1 && section.verifyEnd) {
      content += file.substring(endIndex);
    }
    lastEndIndex = endIndex;
  });

  console.log(errors);
  if (errors.length) {
    throw new Error(
      `One or more context lines could not be resolved uniquely:\n\`\`\`\n${updateLines
        .map((line, i) => `${errors.includes(i) ? "X " : "  "}${line}`)
        .join("\n")}\n\`\`\``
    );
  }

  return content;
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
