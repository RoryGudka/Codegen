require("dotenv").config();
const OpenAI = require("openai");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createEditFileAssistant({
  name,
  custom_instructions,
  model = "gpt-4-turbo-preview",
  edit_capabilities = ["refactor", "optimize", "debug", "document", "test"],
  target_languages = ["javascript", "python", "typescript"],
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
            name: "analyze_code",
            description: "Analyze code for potential improvements or issues",
            parameters: {
              type: "object",
              properties: {
                file_path: {
                  type: "string",
                  description: "Path to the file to analyze",
                },
                analysis_type: {
                  type: "string",
                  enum: ["complexity", "performance", "security", "style"],
                  description: "Type of analysis to perform",
                },
              },
              required: ["file_path", "analysis_type"],
            },
          },
        },
      ],
      metadata: {
        type: "code_editor",
        capabilities: edit_capabilities,
        supported_languages: target_languages,
      },
    });

    console.log("Code Edit Assistant created successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);
    console.log("Edit Capabilities:", edit_capabilities);
    console.log("Target Languages:", target_languages);
    return assistant;
  } catch (error) {
    console.error("Error creating code edit assistant:", error);
    throw error;
  }
}

module.exports = {
  createEditFileAssistant,
};
