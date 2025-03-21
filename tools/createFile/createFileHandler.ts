import fs from "fs";
import { handleAssistantStream } from "../../streamHelper";
import { openai } from "../../clients/openai";
import path from "path";

interface CreateFileParams {
  contextFilePaths?: string[];
  newFilePath: string;
  instructions: string;
}

export const createFileHandler = async ({
  contextFilePaths = [],
  newFilePath,
  instructions,
}: CreateFileParams): Promise<string> => {
  const fullNewFilePath = path.join(process.cwd(), newFilePath);
  const fullContextFilePaths = contextFilePaths.map((p) =>
    path.join(process.cwd(), p)
  );

  // Check if file already exists
  if (fs.existsSync(fullNewFilePath)) {
    return "File already exists. Try again with editFile or corrected file path.";
  }

  const contextFileContents: [string, string][] = fullContextFilePaths.map(
    (path) => [path, fs.readFileSync(path, "utf8")]
  );

  try {
    const assistant = await openai.beta.assistants.create({
      name: "Create File Assistant",
      instructions: `You are a coding assistant specially designed to create new files with given instructions and context files. Make sure to follow the instructions carefully, and do NOT add placeholder text like \`\/\/Insert code here\/\/\`. Respond with the new code only, not in a code block, and with no additional text.\n\n--------------------\nNEW FILE TO CREATE: ${newFilePath}\n--------------------\n\n${contextFileContents
        .map(
          ([path, content]) =>
            `--------------------\nCONTEXT FILE:${path}\n--------------------\n\n${content}`
        )
        .join("\n\n")}`,
      model: "gpt-4o",
      tools: [],
    });

    console.log("Assistant created successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);
    console.log("Available Tools:", assistant.tools.length);

    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: instructions,
    });

    const stream = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      stream: true,
    });

    const content = await handleAssistantStream(stream, assistant.id);

    // Create directory if it doesn't exist
    const dirPath = path.dirname(fullNewFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(fullNewFilePath, content);
    return "File created successfully";
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};
