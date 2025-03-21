import { createFileQuestionAssistant } from "./createFileQuestionAssistant";
import fs from "fs";
import { handleAssistantStream } from "../../streamHelper";
import { openai } from "../../clients/openai";
import path from "path";

interface AskFileQuestionParams {
  filePaths: string[];
  question: string;
}

export const askFileQuestionHandler = async ({
  filePaths,
  question,
}: AskFileQuestionParams): Promise<string> => {
  const fullFilePaths = filePaths.map((filePath) =>
    path.join(process.cwd(), filePath)
  );

  const invalidFilePaths = fullFilePaths.filter(
    (fullFilePath) => !fs.existsSync(fullFilePath)
  );

  if (invalidFilePaths.length) {
    return `File paths does not exist. Try again with corrected file paths.\nInvalid file paths: ${invalidFilePaths.join(
      ", "
    )}`;
  }

  const fileContents: [string, string][] = fullFilePaths.map((fullFilePath) => [
    fullFilePath,
    fs.readFileSync(fullFilePath, "utf8"),
  ]);

  const assistant = await createFileQuestionAssistant(fileContents);

  const thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: question,
  });

  const stream = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    stream: true,
  });

  return await handleAssistantStream(stream, assistant.id);
};
