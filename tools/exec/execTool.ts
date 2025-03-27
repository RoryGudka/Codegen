import { ChatCompletionTool } from "openai/resources/chat/index";

const execTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "exec",
    description:
      "Executes a terminal command and returns the output or error. Avoid commands that will prompt you, as this functionality is currently unavailable.",
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "The terminal command to execute",
        },
      },
      required: ["command"],
    },
  },
};

export { execTool };
