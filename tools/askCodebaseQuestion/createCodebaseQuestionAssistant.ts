import OpenAI from "openai";
import dotenv from "dotenv";
import { openai } from "../../clients/openai";

dotenv.config();

async function createCodebaseQuestionAssistant(): Promise<OpenAI.Beta.Assistants.Assistant> {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Codebase Question Assistant",
      instructions:
        "This assistant is specialized in addressing broader questions about the codebase. It provides context about multiple files and their interactions, helping to understand overall architecture, design patterns, and codebase-level inquiries.",
      model: "gpt-4o",
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
        {
          type: "function",
          function: {
            name: "contextual_analysis",
            description:
              "Provide context about multiple files and their interactions within the codebase",
            parameters: {
              type: "object",
              properties: {
                files: {
                  type: "array",
                  items: {
                    type: "string",
                    description: "File paths to be analyzed",
                  },
                  description:
                    "List of files to analyze for interaction context",
                },
              },
              required: ["files"],
            },
          },
        },
      ],
    });

    console.log("Codebase QA Assistant created successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);

    return assistant;
  } catch (error) {
    console.error("Error creating codebase QA assistant:", error);
    throw error;
  }
}

export { createCodebaseQuestionAssistant };
