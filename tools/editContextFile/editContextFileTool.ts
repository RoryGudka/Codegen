import { ChatCompletionTool } from "openai/resources/chat";

const editContextFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "editContextFile",
    description:
      "Modifies the codebase context file to save information between requests.",
    parameters: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "The new content of the context file",
        },
      },
      required: ["content"],
    },
  },
};

export { editContextFileTool };
