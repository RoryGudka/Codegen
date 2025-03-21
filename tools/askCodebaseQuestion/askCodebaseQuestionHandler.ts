import { handleAssistantStream, openai } from "../../streamHelper";

import { createCodebaseQuestionAssistant } from "./createCodebaseQuestionAssistant";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const verifyFilePaths = (filePaths: string[]): boolean => {
  return filePaths.every((filePath) => fs.existsSync(filePath));
};

interface AskCodebaseQuestionParams {
  question: string;
}

const askCodebaseQuestionHandler = async ({
  question,
}: AskCodebaseQuestionParams): Promise<string> => {
  const assistant = await createCodebaseQuestionAssistant();

  const thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: question,
  });

  const stream = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    stream: true,
  });

  const content = await handleAssistantStream(stream, assistant.id);
  const outputPath = path.join(__dirname, "output.txt");
  fs.writeFileSync(outputPath, content);

  return content;
};

export { askCodebaseQuestionHandler, verifyFilePaths };
