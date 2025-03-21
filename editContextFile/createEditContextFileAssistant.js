require("dotenv").config();
const OpenAI = require("openai");

const editContextFileTool = {
  type: "function",
  function: {
    name: "write_file",
    description: "Write or update contents of a file",
    parameters: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "Path to the file to write",
        },
        content: {
          type: "string",
          description: "Content to write to the file",
        },
      },
      required: ["file_path", "content"],
    },
  },
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createEditContextFileAssistant({
  name,
  custom_instructions,
  model = "gpt-4-turbo-preview",
  file_types = ["txt", "md", "json"],
}) {
  try {
    const assistant = await openai.beta.assistants.create({
      name: name,
      instructions: custom_instructions,
      model: model,
      tools: [editContextFileTool],
      metadata: {
        type: "context_editor",
        supported_file_types: file_types,
      },
    });

    console.log("Context Editor Assistant created successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);
    console.log("Supported File Types:", file_types);
    return assistant;
  } catch (error) {
    console.error("Error creating context editor assistant:", error);
    throw error;
  }
}

module.exports = {
  createEditContextFileAssistant,
};
