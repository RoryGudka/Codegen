import { anthropic } from "../../clients/anthropic";
import fs from "fs";
import path from "path";
import { retryWithRateLimit } from "../../helpers/retryWithRateLimit";
import { runEslintOnFile } from "../../helpers/runEslintOnFile";
import { runPrettierOnFile } from "../../helpers/runPrettierOnFile";

interface EditFileParams {
  editFilePath: string;
  update: string;
  description: string;
}

interface SearchReplaceBlock {
  searchText: string;
  replaceText: string;
}

// Levenshtein distance calculation
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

// Normalize text for better matching (remove extra whitespace, normalize line endings)
function normalizeText(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\t/g, "  ").trim();
}

// Parse search/replace blocks from the update string
function parseSearchReplaceBlocks(update: string): SearchReplaceBlock[] {
  const blocks: SearchReplaceBlock[] = [];
  const regex =
    /<<<<<<< SEARCH\n([\s\S]*?)\n=======\n([\s\S]*?)\n?>>>>>>> REPLACE/g;

  let match;
  while ((match = regex.exec(update)) !== null) {
    const [, searchText, replaceText] = match;

    blocks.push({
      searchText: searchText.trim(),
      replaceText: replaceText.trim(),
    });
  }

  return blocks;
}

// Find the best match for search text in file content using Levenshtein distance
function findBestMatch(
  fileLines: string[],
  searchText: string
): { startIndex: number; endIndex: number; distance: number } | null {
  const normalizedSearchText = normalizeText(searchText);
  const searchLines = normalizedSearchText.split("\n");

  let bestMatch = null;
  let bestDistance = Infinity;

  // Define search range
  const searchStart = 0;
  const searchEnd = fileLines.length;

  // Try to find the best match within the specified range or entire file
  for (let i = searchStart; i <= searchEnd - searchLines.length; i++) {
    const candidateLines = fileLines.slice(i, i + searchLines.length);
    const candidateText = normalizeText(candidateLines.join("\n"));

    const distance = levenshteinDistance(normalizedSearchText, candidateText);

    // Accept match if it's exact or very close (allowing for minor formatting differences)
    const maxAllowedDistance = Math.max(5, normalizedSearchText.length * 0.1);

    if (distance < bestDistance && distance <= maxAllowedDistance) {
      bestDistance = distance;
      bestMatch = {
        startIndex: i,
        endIndex: i + searchLines.length - 1,
        distance,
      };

      // If we found an exact match, use it immediately
      if (distance === 0) {
        break;
      }
    }
  }

  return bestMatch;
}

// Apply all search/replace blocks to the file content
function applySearchReplaceBlocks(
  fileContent: string,
  blocks: SearchReplaceBlock[]
): { success: boolean; result: string; errors: string[] } {
  const fileLines = fileContent.split("\n");
  const errors: string[] = [];

  // Sort blocks by starting position in reverse order to avoid index shifting
  // Since we no longer have line numbers, we need to find matches first
  const blocksWithPositions = blocks.map((block) => {
    const match = findBestMatch(fileLines, block.searchText);
    return { block, match };
  });

  // Filter out blocks that couldn't find matches
  const validBlocks = blocksWithPositions.filter(({ match }) => match !== null);

  // Sort by start position in reverse order
  validBlocks.sort((a, b) => b.match!.startIndex - a.match!.startIndex);

  for (const { block, match } of validBlocks) {
    if (!match) {
      errors.push(
        `Could not find match for search text: "${block.searchText.substring(0, 50)}..."`
      );
      continue;
    }

    // Replace the matched lines with the replacement text
    const replaceLines = block.replaceText.split("\n");
    fileLines.splice(
      match.startIndex,
      match.endIndex - match.startIndex + 1,
      ...replaceLines
    );
  }

  // Add errors for blocks that couldn't find matches
  const failedBlocks = blocksWithPositions.filter(
    ({ match }) => match === null
  );
  for (const { block } of failedBlocks) {
    errors.push(
      `Could not find match for search text: "${block.searchText.substring(0, 50)}..."`
    );
  }

  return {
    success: errors.length === 0,
    result: fileLines.join("\n"),
    errors,
  };
}

// Backup function to create file content using Anthropic Claude 3.5 Haiku
async function createFileContentWithAnthropic(
  originalContent: string,
  update: string,
  description: string
): Promise<string> {
  const systemPrompt = `You are a code editor assistant. Your task is to modify the provided file content based on the user's update instructions and description.

Rules:
1. Apply the requested changes as described in the update and description
2. Preserve the original file structure and formatting style as much as possible
3. Only modify what is specifically requested
4. Return only the complete modified file content, without any explanations or markdown formatting
5. If the update contains search/replace blocks in the format <<<<<<< SEARCH ... ======= ... >>>>>>> REPLACE, apply those changes
6. If the update is in a different format, interpret it as general instructions and apply the changes accordingly

Description of desired changes: ${description}`;

  const userPrompt = `Original file content:
\`\`\`
${originalContent}
\`\`\`

Update instructions:
\`\`\`
${update}
\`\`\`

Please provide the complete modified file content:`;

  try {
    const response = await retryWithRateLimit(async () => {
      return await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 8000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });
    });

    const block = response.content[0];
    if (block.type !== "text") {
      throw new Error("Response was not text");
    }

    return block.text.trim();
  } catch (error) {
    throw new Error(`Anthropic backup call failed: ${error}`);
  }
}

const editFileHandler = async ({
  editFilePath,
  update,
  description,
}: EditFileParams): Promise<string> => {
  try {
    const fullEditFilePath = path.join(process.cwd(), editFilePath);

    if (!fs.existsSync(fullEditFilePath)) {
      return "File path does not exist. Try again with createFile or corrected file path.";
    }

    const fileContent = fs.readFileSync(fullEditFilePath, "utf8");
    const blocks = parseSearchReplaceBlocks(update);
    if (blocks.length === 0) {
      return "No valid search/replace blocks found in the update. Please use the correct format:\n<<<<<<< SEARCH\n(search text)\n=======\n(replace text)\n>>>>>>> REPLACE";
    }

    // Apply the search/replace operations
    const { success, result, errors } = applySearchReplaceBlocks(
      fileContent,
      blocks
    );

    if (!success) {
      // Try backup method using Anthropic Claude 3.5 Haiku
      try {
        console.log(
          "Search/replace failed, attempting backup with Claude 3.5 Haiku..."
        );
        const backupResult = await createFileContentWithAnthropic(
          fileContent,
          update,
          description
        );

        // Write the backup result to the file
        fs.writeFileSync(fullEditFilePath, backupResult);

        // Run formatting and linting
        const formattingResult = await runPrettierOnFile(fullEditFilePath);
        const lintingResult = await runEslintOnFile(fullEditFilePath);

        return `Search/replace method failed, but backup with Claude 3.5 Haiku succeeded.\nOriginal errors:\n${errors.join("\n")}\n\nFile edited successfully using AI backup method.\nFormatting result:\n${formattingResult}\nLinting result:\n${lintingResult}`;
      } catch (backupError) {
        return `Both search/replace and backup methods failed.\nSearch/replace errors:\n${errors.join("\n")}\n\nBackup method error:\n${backupError}\n\nPlease check that the search text exactly matches the existing code or try a different approach.`;
      }
    }

    // Write the updated content to the file
    fs.writeFileSync(fullEditFilePath, result);

    // Run formatting and linting
    const formattingResult = await runPrettierOnFile(fullEditFilePath);
    const lintingResult = await runEslintOnFile(fullEditFilePath);

    return `File edited successfully using search/replace method.\nApplied ${blocks.length} search/replace operation(s).\nFormatting result:\n${formattingResult}\nLinting result:\n${lintingResult}`;
  } catch (e: any) {
    console.error(e);
    return `Failed to edit file: ${e.message}`;
  }
};

export { editFileHandler };
