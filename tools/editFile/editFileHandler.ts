import fs from "fs";
import path from "path";
import { patienceDiff } from "../../helpers/patienceDiff";
import { runEslintOnFile } from "../../helpers/runEslintOnFile";
import { runPrettierOnFile } from "../../helpers/runPrettierOnFile";

interface EditFileParams {
  editFilePath: string;
  update: string;
}

interface Edit {
  startLine: number;
  endLine: number;
  content: string[];
}

interface ContextMatch {
  line: string;
  index: number;
  confidence: number;
}

// Strategy 1: Line-based edits (most precise)
const parseLineBasedEdit = (update: string): Edit[] | null => {
  const lines = update.split("\n");
  const edits: Edit[] = [];
  let currentEdit: Partial<Edit> | null = null;

  for (const line of lines) {
    // Match patterns like "// Lines 10-15:" or "/* Lines 10-15: */"
    const lineRangeMatch = line.match(
      /^(?:\/\/|\/\*|#)\s*Lines?\s+(\d+)(?:-(\d+))?:?\s*(?:\*\/)?$/i
    );
    if (lineRangeMatch) {
      if (currentEdit) {
        edits.push(currentEdit as Edit);
      }
      const startLine = parseInt(lineRangeMatch[1]) - 1; // Convert to 0-based
      const endLine = lineRangeMatch[2]
        ? parseInt(lineRangeMatch[2]) - 1
        : startLine;
      currentEdit = { startLine, endLine, content: [] };
      continue;
    }

    if (currentEdit) {
      currentEdit.content!.push(line);
    }
  }

  if (currentEdit) {
    edits.push(currentEdit as Edit);
  }

  return edits.length > 0 ? edits : null;
};

// Strategy 2: Context-based matching with fuzzy search
const findBestContextMatch = (
  needle: string[],
  haystack: string[]
): ContextMatch[] => {
  const matches: ContextMatch[] = [];

  for (let i = 0; i <= haystack.length - needle.length; i++) {
    let matchScore = 0;

    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] === needle[j]) {
        matchScore += 1;
      } else {
        // Fuzzy matching: check similarity
        const similarity = calculateSimilarity(haystack[i + j], needle[j]);
        matchScore += similarity * 0.5; // Weight fuzzy matches less
      }
    }

    const confidence = matchScore / needle.length;
    if (confidence > 0.7) {
      // Only consider good matches
      matches.push({
        line: haystack[i],
        index: i,
        confidence,
      });
    }
  }

  return matches.sort((a, b) => b.confidence - a.confidence);
};

const calculateSimilarity = (str1: string, str2: string): number => {
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;

  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return 1 - distance / maxLen;
};

// Strategy 3: Enhanced placeholder-based edits
const parseEnhancedPlaceholderEdit = (
  update: string,
  fileLines: string[]
): string[] | null => {
  const placeholderRegex = /^\s*{{\s*\.\.\.\s*}}\s*$/;
  const updateLines = update.split("\n");

  // Check if this is a placeholder-based edit
  const hasPlaceholders = updateLines.some((line) =>
    placeholderRegex.test(line)
  );
  if (!hasPlaceholders) return null;

  try {
    return applyEnhancedPlaceholderEdit(fileLines, updateLines);
  } catch (error) {
    console.warn("Enhanced placeholder edit failed:", error);
    return null;
  }
};

const applyEnhancedPlaceholderEdit = (
  fileLines: string[],
  updateLines: string[]
): string[] => {
  const placeholderRegex = /^\s*{{\s*\.\.\.\s*}}\s*$/;
  const result: string[] = [];
  let fileIndex = 0;
  let updateIndex = 0;

  while (updateIndex < updateLines.length) {
    const updateLine = updateLines[updateIndex];

    if (placeholderRegex.test(updateLine)) {
      // Find the next non-placeholder section to determine how much to skip
      let nextSectionStart = updateIndex + 1;
      while (
        nextSectionStart < updateLines.length &&
        placeholderRegex.test(updateLines[nextSectionStart])
      ) {
        nextSectionStart++;
      }

      if (nextSectionStart < updateLines.length) {
        // Look for the next section in the file
        const nextSection = updateLines.slice(
          nextSectionStart,
          Math.min(nextSectionStart + 5, updateLines.length)
        );
        const match = findBestContextMatch(
          nextSection,
          fileLines.slice(fileIndex)
        );

        if (match.length > 0 && match[0].confidence > 0.8) {
          // Copy lines from file until we reach the match
          const targetIndex = fileIndex + match[0].index;
          while (fileIndex < targetIndex) {
            result.push(fileLines[fileIndex++]);
          }
          updateIndex = nextSectionStart;
        } else {
          throw new Error(
            `Could not find context match for section starting at line ${nextSectionStart + 1}`
          );
        }
      } else {
        // This is the final placeholder, copy the rest of the file
        while (fileIndex < fileLines.length) {
          result.push(fileLines[fileIndex++]);
        }
        updateIndex++;
      }
    } else {
      // This is new content, add it directly
      result.push(updateLine);
      updateIndex++;

      // Skip corresponding lines in the original file if they match
      if (fileIndex < fileLines.length && fileLines[fileIndex] === updateLine) {
        fileIndex++;
      }
    }
  }

  return result;
};

// Strategy 4: Diff-based approach using patience diff
const applyDiffBasedEdit = (fileContent: string, update: string): string => {
  const fileLines = fileContent.split("\n");
  const updateLines = update.split("\n");

  // Use patience diff to find the optimal merge
  const diff = patienceDiff(fileLines, updateLines);
  const result: string[] = [];

  for (const line of diff.lines) {
    if (line.bIndex !== -1) {
      // Line exists in update, use it
      result.push(line.line);
    } else if (line.aIndex !== -1) {
      // Line only exists in original, include it unless it's clearly being replaced
      result.push(line.line);
    }
  }

  return result.join("\n");
};

// Main edit application function with fallback strategies
export const applyUpdate = (fileContent: string, update: string): string => {
  const fileLines = fileContent.split("\n");

  try {
    // Strategy 1: Try line-based edits first (most precise)
    const lineBasedEdits = parseLineBasedEdit(update);
    if (lineBasedEdits) {
      console.log("Applying line-based edits...");
      const result = [...fileLines];

      // Sort edits by start line in reverse order to avoid index shifting
      lineBasedEdits.sort((a, b) => b.startLine - a.startLine);

      for (const edit of lineBasedEdits) {
        // Remove old lines and insert new content
        result.splice(
          edit.startLine,
          edit.endLine - edit.startLine + 1,
          ...edit.content
        );
      }

      return result.join("\n");
    }

    // Strategy 2: Try enhanced placeholder-based edits
    const placeholderResult = parseEnhancedPlaceholderEdit(update, fileLines);
    if (placeholderResult) {
      console.log("Applying enhanced placeholder-based edits...");
      return placeholderResult.join("\n");
    }

    // Strategy 3: Try diff-based approach
    console.log("Applying diff-based edits...");
    return applyDiffBasedEdit(fileContent, update);
  } catch (error: any) {
    console.error("All edit strategies failed:", error);

    // Strategy 4: Intelligent fallback - try to preserve structure
    console.log("Falling back to intelligent merge...");

    // If update looks like a complete file (has common file patterns), use it directly
    const updateLines = update.split("\n");
    const hasImports = updateLines.some(
      (line) =>
        line.trim().startsWith("import ") ||
        line.trim().startsWith("const ") ||
        line.trim().startsWith("function ")
    );
    const hasExports = updateLines.some((line) =>
      line.trim().startsWith("export ")
    );

    if (hasImports && hasExports && updateLines.length > 5) {
      console.log("Update appears to be a complete file, using it directly...");
      return update;
    }

    // Otherwise, try a simple context-based merge
    try {
      const contextLines = Math.min(3, Math.floor(updateLines.length / 4));
      if (contextLines > 0) {
        const startContext = updateLines.slice(0, contextLines);
        const endContext = updateLines.slice(-contextLines);

        const startMatch = findBestContextMatch(startContext, fileLines);
        const endMatch = findBestContextMatch(endContext, fileLines);

        if (startMatch.length > 0 && endMatch.length > 0) {
          const startIndex = startMatch[0].index;
          const endIndex = endMatch[0].index + endContext.length;

          return [
            ...fileLines.slice(0, startIndex),
            ...updateLines,
            ...fileLines.slice(endIndex),
          ].join("\n");
        }
      }
    } catch (contextError) {
      console.error("Context-based fallback failed:", contextError);
    }

    // Final fallback: return original with error
    throw new Error(
      `Could not apply edit safely. Original error: ${error.message}`
    );
  }
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

    return `File edited successfully using intelligent edit strategies.\nFormatting result:\n${formattingResult}\nLinting result:\n${lintingResult}\n\nEdit applied successfully. The system used the most appropriate strategy based on your input format.`;
  } catch (e: any) {
    console.error(e);

    // Enhanced error recovery
    try {
      const fullEditFilePath = path.join(process.cwd(), editFilePath);
      const fileContent = fs.readFileSync(fullEditFilePath, "utf8");

      return `Error applying edit: ${e.message}

The edit could not be applied safely. Here are some suggestions:

1. **For precise edits**: Use line number comments like "// Lines 10-15:" followed by the new content
2. **For context-based edits**: Include more surrounding context lines to help identify the location
3. **For complete rewrites**: Provide the entire file content without placeholders

Current file content:
\`\`\`
${fileContent}
\`\`\`

Please try again with a clearer edit format.`;
    } catch (readError: any) {
      return `Error: ${e.message}. Additionally, could not read file for debugging: ${readError.message}`;
    }
  }
};

export { editFileHandler };
