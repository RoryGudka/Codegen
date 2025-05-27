import { MessageParam } from "@anthropic-ai/sdk/resources";
import { anthropic } from "../clients/anthropic";
import { retryWithRateLimit } from "./retryWithRateLimit";

/**
 * Extracts relevant lines from a file using AI, considering context from messages
 * @param filePath - Path to the file to analyze
 * @param messages - The conversation context
 * @returns A string with numbered relevant lines and "..." for skipped sections
 */
export async function getRelevantFileContent(
  filePath: string,
  numberedContent: string,
  messages: MessageParam[]
): Promise<string> {
  try {
    const lines = numberedContent.split("\n");
    const context = JSON.stringify(messages);

    const systemPrompt = `You are a code analyzer that identifies relevant sections of code based on a coding assistant's context.
Your task is to:
1. Analyze the file content provided
2. Identify which line numbers are most relevant to the user's query/context
3. Return a JSON with the following details:
  - Contains an array called "relevantLineRanges" that includes all ranges of important lines. The values "start" and "end" should both be present, and they are one-indexed and inclusive.
  - Contains a string called "summaryOfExcludedLines" that concisely summarizes all lines not shown. 
  - Format: { "relevantLineRanges": [{"start": number, "end": number}, ...], "summaryOfExcludedLines": string }

Use these guidelines:
- Include code sections directly relevant to the user's context
- Keep important structural elements like function declarations
- Include only the most relevant parts to understand the code
- Be judicious - don't include everything
- Group related lines to avoid too many separate ranges`;

    // Call the AI model with retry for rate limits
    const response = await retryWithRateLimit(async () => {
      return await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `User's context: ${context}\n\nFile content to analyze (${filePath}):\n${numberedContent}`,
          },
        ],
      });
    });

    // Extract relevant line ranges from AI response
    const block = response.content[0];
    if (block.type !== "text") throw new Error("Response was not text");

    const { relevantLineRanges, summaryOfExcludedLines } = JSON.parse(
      block.text
    ) as {
      relevantLineRanges: { start: number; end: number }[];
      summaryOfExcludedLines: string;
    };

    // Sort ranges by start line
    relevantLineRanges.sort((a, b) => a.start - b.start);

    // Generate the output with line numbers and "..." for skipped sections
    let result = "";
    let lastEnd = 0;

    for (const range of relevantLineRanges) {
      const start = range.start;
      const end = range.end;

      // Add "..." if there's a gap between ranges
      if (start > lastEnd + 1) {
        result += "\n...\n\n";
      }

      // Add the lines in the current range with line numbers
      for (let i = start; i <= end && i <= lines.length; i++) {
        result += `${i}. ${lines[i - 1]}\n`;
      }

      lastEnd = end;
    }

    // Add final "..." if we didn't include the end of the file
    if (lastEnd < lines.length) {
      result += "\n...\n";
    }

    return JSON.stringify(
      { relevantFileContent: result.trim(), summaryOfExcludedLines },
      null,
      2
    );
  } catch (error) {
    console.error("Error in getRelevantFileContent:", error);
    // Fall back to the standard numbered content on error
    return numberedContent;
  }
}
