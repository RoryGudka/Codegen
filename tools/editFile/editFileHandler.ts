import { anthropic } from "../../clients/anthropic";
import fs from "fs";
import path from "path";
import { runEslintOnFile } from "../../helpers/runEslintOnFile";
import { runPrettierOnFile } from "../../helpers/runPrettierOnFile";

interface EditFileParams {
  editFilePath: string;
  update: string;
  description: string;
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

    // Use Claude-3-5-Haiku to generate the edit
    const prompt = `You are an expert code editor. Given a file, an update, and a description of desired changes, generate the final file content.

CRITICAL RULES FOR EDITING:
1. The special placeholder {{ ... }} represents unchanged code
2. Do NOT include any {{ ... }} placeholders in your final response
3. Do NOT include any text other than the final file content in your text
4. Do NOT include code block characters \`\`\` in your response

Original file:
\`\`\`
${fileContent}
\`\`\`

Update:
\`\`\`
${update}
\`\`\`

Description of changes:
${description}`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const updatedContent =
      response.content[0].type === "text" ? response.content[0].text : "";

    if (!updatedContent.trim()) {
      return "Failed to generate edit: Empty response from AI model";
    }

    fs.writeFileSync(fullEditFilePath, updatedContent);

    const formattingResult = await runPrettierOnFile(fullEditFilePath);
    const lintingResult = await runEslintOnFile(fullEditFilePath);

    return `File edited successfully using AI model.\nDescription: ${description}\nFormatting result:\n${formattingResult}\nLinting result:\n${lintingResult}\n\nThis is the final file content. If this is not correct, edit the file again with a more specific description:\n\n${updatedContent}`;
  } catch (e: any) {
    console.error(e);
    return `Failed to edit file: ${e.message}`;
  }
};

export { editFileHandler };
