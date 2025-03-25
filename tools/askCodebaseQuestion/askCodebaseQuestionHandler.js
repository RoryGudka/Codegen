require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { openai } = require("../../clients/openai");
const {
  handleAssistantStream,
} = require("../../helpers/handleAssistantStream");

const verifyFilePaths = (filePaths) => {
  return filePaths.every((filePath) => fs.existsSync(filePath));
};

const askCodebaseQuestionHandler = async (question, filePaths) => {
  if (!verifyFilePaths(filePaths)) {
    throw new Error("One or more file paths are invalid.");
  }

  try {
    const assistant = await createCodebaseQuestionAssistant();

    const thread = await openai.beta.threads.create();

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
  }
};

module.exports = {
  askCodebaseQuestionHandler,
};
