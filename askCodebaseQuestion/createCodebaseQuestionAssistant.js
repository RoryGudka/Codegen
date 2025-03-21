require("dotenv").config();
const OpenAI = require("openai");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createCodebaseQuestionAssistant({
  name,
  custom_instructions,
  model = "gpt-4-turbo-preview",
  programming_languages = ["javascript", "python", "typescript"],
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
            name: "search_codebase",
            description:
              "Search through the codebase for specific patterns or functionality",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query to find relevant code",
                },
                file_pattern: {
                  type: "string",
                  description:
                    "File pattern to limit search scope (e.g., *.js, *.py)",
                },
              },
              required: ["query"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "analyze_dependencies",
            description: "Analyze project dependencies and their relationships",
            parameters: {
              type: "object",
              properties: {
                file_path: {
                  type: "string",
                  description:
                    "Path to the dependency file (e.g., package.json, requirements.txt)",
                },
              },
              required: ["file_path"],
            },
          },
        },
      ],
      metadata: {
        type: "codebase_qa",
        supported_languages: programming_languages,
      },
    });

    console.log("Codebase QA Assistant created successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);
    console.log("Supported Languages:", programming_languages);
    return assistant;
  } catch (error) {
    console.error("Error creating codebase QA assistant:", error);
    throw error;
  }
}

module.exports = {
  createCodebaseQuestionAssistant,
};
