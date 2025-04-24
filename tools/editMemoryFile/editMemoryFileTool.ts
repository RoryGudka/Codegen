import { ChatCompletionTool } from "openai/resources/chat/index";

const editMemoryFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "editMemoryFile",
    description:
      "Modifies the memory file for the workspace to maintain important knowledge between requests.",
    parameters: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "The new content of the memory file",
        },
      },
      required: ["content"],
    },
  },
};

export { editMemoryFileTool };
