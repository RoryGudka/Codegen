import { ChatCompletionTool } from "openai/resources/chat";

const deleteFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "deleteFile",
    description:
      "Deletes a file at the given path. Returns an error message if the file does not exist.",
    parameters: {
      type: "object",
      properties: {
        deleteFilePath: {
          type: "string",
          description: "The path to the file to delete",
        },
      },
      required: ["deleteFilePath"],
    },
  },
};

export { deleteFileTool };
