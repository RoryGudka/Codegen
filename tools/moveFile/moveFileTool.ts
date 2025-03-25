import { ChatCompletionTool } from "openai/resources/chat/index";

const moveFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "moveFile",
    description:
      "Moves a file from a source path to a destination path. Returns an error message if the source file does not exist. Creates destination directories if they do not exist.",
    parameters: {
      type: "object",
      properties: {
        sourcePath: {
          type: "string",
          description: "The source path of the file",
        },
        destinationPath: {
          type: "string",
          description: "The destination path for the file",
        },
      },
      required: ["sourcePath", "destinationPath"],
    },
  },
};

export { moveFileTool };
