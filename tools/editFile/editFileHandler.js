require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { openai, handleAssistantStream } = require("../../streamHelper");
const { createEditFileAssistant } = require("./createEditFileAssistant");

const editFileHandler = async ({
  contextFilePaths = [],
  editFilePath,
  instructions,
}) => {
  const fullEditFilePath = path.join(process.cwd(), editFilePath);
  const fullContextFilePaths = contextFilePaths.map((p) =>
    path.join(process.cwd(), p)
  );
  const contextFileContents = fullContextFilePaths.map((path) => [
    path,
    fs.readFileSync(path, "utf8"),
  ]);
  const editFileContent = fs.readFileSync(fullEditFilePath, "utf8");

  if (!fs.existsSync(fullEditFilePath)) {
    return "File path does not exist. Try again with createFile orcorrected file path.";
  }

  try {
    const assistant = await createEditFileAssistant(
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
  }
};

module.exports = {
  editFileHandler,
};
