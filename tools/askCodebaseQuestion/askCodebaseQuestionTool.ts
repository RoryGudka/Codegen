import { ChatCompletionTool } from "openai/resources/chat";

const askCodebaseQuestionTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "askCodebaseQuestion",
    description:
      "Analyzes specified directories within the codebase to answer a given question",
    parameters: {
      type: "object",
      properties: {
        directories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of directory paths to analyze",
        },
        question: {
          type: "string",
          description: "The question pertaining to the entire codebase",
        },
      },
      required: ["directories", "question"],
    },
  },
};

export { askCodebaseQuestionTool };
