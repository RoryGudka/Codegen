import type { AssistantTool } from "../../types/openai";

export const askFileQuestionTool: AssistantTool = {
  type: "function",
  function: {
    name: "askFileQuestion",
    description:
      "Asks a question about specific files in the codebase and returns a response based on their contents.",
    parameters: {
      type: "object",
      properties: {
        filePaths: {
          type: "array",
          items: {
            type: "string",
            description: "A file path to analyze",
          },
          description: "The paths to the files to analyze",
        },
        question: {
          type: "string",
          description: "The question to ask about the files",
        },
      },
      required: ["filePaths", "question"],
    },
  },
};
