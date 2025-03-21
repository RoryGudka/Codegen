require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { openai, handleAssistantStream } = require("../streamHelper");

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

  try {
    const assistant = await openai.beta.assistants.create({
      name: "Edit File Assistant",
      instructions: `You are a coding assistant specially designed to edit files with given instructions and context files. Make sure to follow the instructions carefully, and do NOT add placeholder text like \`\/\/Old code\/\/\`. Respond with the edited code only.\n\n--------------------\nFILE TO EDIT: ${editFilePath}\n--------------------\n\n${editFileContent}\n\n${contextFileContents
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

    console.log(assistant.id);
    console.log(stream);
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
