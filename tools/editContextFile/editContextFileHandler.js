const fs = require("fs");
const path = require("path");
const { openai } = require("../../clients/openai");
const { handleAssistantStream } = require("../../streamHelper");
const {
  createEditContextFileAssistant,
} = require("./createEditContextFileAssistant");

const editContextFileHandler = async ({ update }) => {
  const fullEditFilePath = path.join(process.cwd(), ".codegen/context.txt");

  // Create directory if it doesn't exist
  const dirPath = path.dirname(fullEditFilePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Create file with empty content if it doesn't exist
  if (!fs.existsSync(fullEditFilePath)) {
    fs.writeFileSync(fullEditFilePath, "");
  }

  const contextFileContent = fs.readFileSync(fullEditFilePath, "utf8");

  try {
    const assistant = await createEditContextFileAssistant(contextFileContent);

    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: update,
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
  }
};

module.exports = {
  editContextFileHandler,
};
