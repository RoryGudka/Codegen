import { createCodebaseQuestionAssistant } from "./createCodebaseQuestionAssistant";
import fs from "fs";
import { handleAssistantStream } from "../../helpers/handleAssistantStream";
import { openai } from "../../clients/openai";
import path from "path";

const verifyFilePaths = (filePaths: string[]): boolean => {
  return filePaths.every((filePath) => fs.existsSync(filePath));
};

const askCodebaseQuestionHandler = async (
  question: string,
  filePaths: string[]
): Promise<any> => {
  if (!verifyFilePaths(filePaths)) {
    throw new Error("One or more file paths are invalid.");
  }

  try {
    const assistant = await createCodebaseQuestionAssistant();
    const thread = await openai.beta.threads.create();

    const fileContents = filePaths
      .map((filePath) => {
        const content = fs.readFileSync(filePath, "utf8");
        return `${filePath}:\n${content}\n`;
      })
      .join("\n");

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `${question}\n\nFiles Content:\n${fileContents}`,
    });

    const stream = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      stream: true,
    });

    const content = await handleAssistantStream(stream, assistant.id);
    const outputPath = path.join(__dirname, "output.txt");
    fs.writeFileSync(outputPath, content);
    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
};

export { askCodebaseQuestionHandler };
