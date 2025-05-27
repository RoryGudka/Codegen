import fs from "fs";
import path from "path";
import * as diffLib from "diff";
import { runEslintOnFile } from "../../helpers/runEslintOnFile";
import { runPrettierOnFile } from "../../helpers/runPrettierOnFile";

interface EditFileParams {
  editFilePath: string;
  update: string;
}

interface ContentSection {
  type: "content";
  startIdx: number;
  lines: string[];
}

interface PlaceholderSection {
  type: "placeholder";
  startIdx: number;
}

type Section = ContentSection | PlaceholderSection;

/**
 * Apply intelligent diff-based updates to a file using placeholders for unchanged content
 * Uses the diff library to handle patching with high reliability
 */
export const applyUpdate = (fileContent: string, update: string): string => {
  // Handle empty files or trivial cases
  if (!fileContent && update) return update;
  if (!update) return fileContent;

  const placeholderRegex = /^\s*{{\s*\.\.\.\s*}}\s*$/;
  const updateLines = update.split("\n");

  // If there are no placeholders, return the entire update (complete file rewrite)
  if (!updateLines.some((line) => placeholderRegex.test(line))) {
    return update;
  }

  // First convert the update with placeholders into a proper patch
  // by replacing placeholders with their corresponding content from the original file
  const fileLines = fileContent.split("\n");

  // Create template content with markers for placeholders
  let templateContent = "";

  // Process the update to create a proper "template" for patching
  for (let i = 0; i < updateLines.length; i++) {
    const line = updateLines[i];

    if (placeholderRegex.test(line)) {
      // Add a marker to help with patching later
      templateContent += `[[PLACEHOLDER_MARKER_${i}]]\n`;
    } else {
      // Copy the line as is
      templateContent += line + "\n";
    }
  }

  // Generate a clean patch between the template and original file
  const patch = diffLib.createPatch(
    "file",
    fileContent,
    templateContent,
    "original",
    "modified",
  );

  // Apply the patch but handle the placeholders specially
  const appliedPatch = diffLib.applyPatch(fileContent, patch, {
    fuzzFactor: 2, // Allow for some fuzziness in matching
  });

  if (typeof appliedPatch !== "string") {
    // If the patch couldn't be applied, fall back to a simpler approach
    // by replacing placeholders with the corresponding content

    // Let's create a more reliable version where we keep track of sections
    const sections: Section[] = [];
    let currentSection: Section | null = null;

    // Identify the sections to keep and replace
    for (let i = 0; i < updateLines.length; i++) {
      const line = updateLines[i];

      if (placeholderRegex.test(line)) {
        if (currentSection) {
          sections.push(currentSection);
          currentSection = null;
        } else {
          // Start a placeholder section
          currentSection = {
            type: "placeholder",
            startIdx: i,
          };
        }
      } else if (currentSection === null) {
        // Start a content section
        currentSection = {
          type: "content",
          startIdx: i,
          lines: [line],
        };
      } else if (currentSection.type === "content") {
        // Continue a content section
        currentSection.lines.push(line);
      }
    }

    // Add the last section if there is one
    if (currentSection) {
      sections.push(currentSection);
    }

    // Build the final result by combining the sections
    let result = "";
    let originalIndex = 0;

    for (const section of sections) {
      if (section.type === "content") {
        // For content sections, use the provided content
        result += section.lines.join("\n") + "\n";
      } else if (section.type === "placeholder") {
        // For placeholder sections, search for the next content section in the original file
        const nextSection = sections.find(
          (s) => s.type === "content" && s.startIdx > section.startIdx,
        ) as ContentSection | undefined;

        if (nextSection) {
          // Look for where the next content section appears in the original file
          const contentToMatch = nextSection.lines.join("\n");
          const originalContent = fileLines.join("\n");
          const matchPos = originalContent.indexOf(
            contentToMatch,
            originalIndex,
          );

          if (matchPos >= 0) {
            // Calculate the line number from character position
            let lineCount = 0;
            for (let i = 0; i < matchPos; i++) {
              if (originalContent[i] === "\n") {
                lineCount++;
              }
            }

            // Extract the original content to preserve
            const contentToPreserve = fileLines
              .slice(originalIndex, lineCount)
              .join("\n");
            result += contentToPreserve + "\n";
            originalIndex = lineCount + nextSection.lines.length;
          }
        } else if (originalIndex < fileLines.length) {
          // If this is the last placeholder, include the rest of the file
          result += fileLines.slice(originalIndex).join("\n") + "\n";
        }
      }
    }

    return result.trim() + (fileContent.endsWith("\n") ? "\n" : "");
  }

  // Replace the placeholder markers in the applied patch with empty strings
  let finalResult = appliedPatch;
  for (let i = 0; i < updateLines.length; i++) {
    finalResult = finalResult.replace(`[[PLACEHOLDER_MARKER_${i}]]`, "");
  }

  return finalResult.trim() + (fileContent.endsWith("\n") ? "\n" : "");
};

/**
 * A simplified implementation that focuses on reliability over complexity
 * This is used as a fallback when the diff approach fails
 */
export const simplifiedApplyUpdate = (
  fileContent: string,
  update: string,
): string => {
  const placeholderRegex = /^\s*{{\s*\.\.\.\s*}}\s*$/;
  const updateLines = update.split("\n");

  // If there are no placeholders, return the entire update (complete file rewrite)
  if (!updateLines.some((line) => placeholderRegex.test(line))) {
    return update;
  }

  // Get sections from the update
  const sections = [];
  let currentSection = [];
  let inPlaceholder = false;

  for (const line of updateLines) {
    if (placeholderRegex.test(line)) {
      if (currentSection.length > 0) {
        sections.push({
          type: inPlaceholder ? "placeholder" : "content",
          content: currentSection.join("\n"),
        });
        currentSection = [];
      }
      inPlaceholder = !inPlaceholder;
    } else {
      currentSection.push(line);
    }
  }

  if (currentSection.length > 0) {
    sections.push({
      type: inPlaceholder ? "placeholder" : "content",
      content: currentSection.join("\n"),
    });
  }

  // Build the final result
  let result = "";
  let lastIndex = 0;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    if (section.type === "content") {
      // Check if this content already exists in the file
      const existingPos = fileContent.indexOf(section.content, lastIndex);

      if (existingPos >= 0) {
        // Content already exists, adjust lastIndex
        result += section.content + "\n";
        lastIndex = existingPos + section.content.length;
      } else {
        // This is new content, insert it
        result += section.content + "\n";
      }
    } else {
      // This is a placeholder - find where the next content section starts in the original file
      if (i < sections.length - 1 && sections[i + 1].type === "content") {
        const nextContent = sections[i + 1].content;
        const pos = fileContent.indexOf(nextContent, lastIndex);

        if (pos >= 0) {
          const preservedContent = fileContent.substring(lastIndex, pos);
          result += preservedContent;
          lastIndex = pos + nextContent.length;
        }
      } else if (i === sections.length - 1) {
        // Last placeholder - include rest of file
        result += fileContent.substring(lastIndex);
      }
    }
  }

  return result;
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

    // Try the advanced approach first
    let updatedContent;
    try {
      updatedContent = applyUpdate(fileContent, update);
    } catch (err) {
      // If that fails, fall back to the simplified approach
      console.log(
        "Advanced diff failed, falling back to simplified approach",
        err,
      );
      updatedContent = simplifiedApplyUpdate(fileContent, update);
    }

    // If all else fails, and we're getting an empty file or obviously incorrect result,
    // just use the update directly if it looks like a complete file
    if (!updatedContent || updatedContent.trim() === "") {
      const placeholderRegex = /^\s*{{\s*\.\.\.\s*}}\s*$/;
      const updateLines = update.split("\n");
      const hasPlaceholders = updateLines.some((line) =>
        placeholderRegex.test(line),
      );

      if (!hasPlaceholders || updateLines.length > 10) {
        // This appears to be a complete file rewrite
        updatedContent = update;
      }
    }

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
