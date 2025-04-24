import { ChatCompletionTool } from "openai/resources/chat/index";

const execTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "exec",
    description:
      "Execute a terminal command on the USER's system. In using these tools, adhere to the following guidelines:\n1. A new shell will be created on each command, so you should cd to the appropriate directory and do necessary setup in addition to running the command each time.\n2. For ANY commands that would use a pager or require user interaction, you should append | cat to the command (or whatever is appropriate). Otherwise, the command will break. You MUST do this for: git, less, head, tail, more, etc.\n3. For commands that are expected to run indefinitely until interruption, please run them in the background. To run jobs in the background, set isBackground to true rather than changing the details of the command.\n4. Don't include any newlines in the command.",
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "The terminal command to execute",
        },
        isBackground: {
          type: "boolean",
          description: "Whether the command should be run in the background",
        },
      },
      required: ["command"],
    },
  },
};

export { execTool };
