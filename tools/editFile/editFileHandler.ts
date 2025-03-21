import { handleAssistantStream, openai } from "../../streamHelper";

import { createEditFileAssistant } from "./createEditFileAssistant";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

interface EditFileParams {
  contextFilePaths?: string[];
  editFilePath: string;
  instructions: string;
}

type ContextFileContent = [string, string];

const editFileHandler = async ({
  contextFilePaths = [],
  editFilePath,
  instructions,
}: EditFileParams): Promise<string> => {
  const fullEditFilePath = path.join(process.cwd(), editFilePath);

  if (!fs.existsSync(fullEditFilePath)) {
    return "File path does not exist. Try again with createFile or corrected file path.";
  }

  const fullContextFilePaths = contextFilePaths.map((p) =>
    path.join(process.cwd(), p)
  );
  const contextFileContents: ContextFileContent[] = fullContextFilePaths.map(
    (path) => [path, fs.readFileSync(path, "utf8")]
  );
  const editFileContent = fs.readFileSync(fullEditFilePath, "utf8");

  try {
    const assistant = await createEditFileAssistant(
      fullEditFilePath,
      editFileContent,
      contextFileContents
    );

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
    fs.writeFileSync(fullEditFilePath, content);

    return "File edited successfully";
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
};

export { editFileHandler, EditFileParams, ContextFileContent };
