require("dotenv").config();
const OpenAI = require("openai");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createFileQuestionAssistant({
  name,
  custom_instructions,
  model = "gpt-4-turbo-preview",
  supported_file_formats = ["txt", "md", "json", "yaml", "xml"],
}) {
  try {
    const assistant = await openai.beta.assistants.create({
      name: name,
      instructions: custom_instructions,
      model: model,
      tools: [
        {
          type: "function",
          function: {
            name: "read_file_content",
            description: "Read and analyze the content of a specific file",
            parameters: {
              type: "object",
              properties: {
                file_path: {
                  type: "string",
                  description: "Path to the file to analyze",
                },
                section: {
                  type: "string",
                  description:
                    "Specific section or range to analyze (optional)",
                },
              },
              required: ["file_path"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "get_file_metadata",
            description: "Get metadata information about a file",
            parameters: {
              type: "object",
              properties: {
                file_path: {
                  type: "string",
                  description: "Path to the file",
                },
              },
              required: ["file_path"],
            },
          },
        },
      ],
      metadata: {
        type: "file_qa",
        supported_formats: supported_file_formats,
      },
    });

    console.log("File QA Assistant created successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);
    console.log("Supported File Formats:", supported_file_formats);
    return assistant;
  } catch (error) {
    console.error("Error creating file QA assistant:", error);
    throw error;
  }
}

module.exports = {
  createFileQuestionAssistant,
};
