import { ChatCompletionTool } from "openai/resources/chat/index";

const readFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "readFile",
    description:
      "Reads the contents of a file with line numbers added. If the file is 250 lines or longer, another model will be called to return only the code deemed relevant to your current context. A concise summary of the excluded lines will also be returned in this case. If you decide you want to read the full contents of the file, you may use the argument `disableTruncation`.",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path of the file to read.",
        },
        disableTruncation: {
          type: "boolean",
          description:
            "If true, disables the automatic truncation of files 250 lines or longer.",
        },
      },
      required: ["filePath"],
    },
  },
};

export { readFileTool };
