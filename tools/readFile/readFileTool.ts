import { ChatCompletionTool } from "openai/resources/chat/index";

const readFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "readFile",
    description:
      "Reads the contents of a file with line numbers added. If the file is 250 lines or longer, another model will be called to return only the code deemed relevant to your current context.",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path of the file to read.",
        },
      },
      required: ["filePath"],
    },
  },
};

export { readFileTool };
