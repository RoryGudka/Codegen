import { ChatCompletionTool } from "openai/resources/chat";

const readFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "readFile",
    description:
      "Reads the contents of a file. Returns an error message if the file does not exist.",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path of the file to read",
        },
      },
      required: ["filePath"],
    },
  },
};

export { readFileTool };
