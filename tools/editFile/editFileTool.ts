import { ChatCompletionTool } from "openai/resources/chat/index";

const editFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "editFile",
    description:
      "Use this tool to edit an existing file. You can choose one of two approaches:\n\n1) Partial edits: Specify ONLY the lines of code that you wish to edit, using the special placeholder {{ ... }} to represent unchanged code. The placeholders will be intelligently replaced with the corresponding content from the original file. Example:\n{{ ... }}\nedited_line_1\n{{ ... }}\nedited_line_2\n{{ ... }}\n\n2) Complete rewrite: If your changes are complex or the edit spans most of the file, you can submit the entire file content without any placeholders. The system will detect this and replace the entire file.\n\nThe edit will be processed using both diff-based patching and context matching to ensure reliable results. For partial edits, include sufficient context around your changes to help with proper placement. Always start and end with {{ ... }} placeholders unless your edit includes the first or last lines of the file.",
    parameters: {
      type: "object",
      properties: {
        editFilePath: {
          type: "string",
          description: "The path to the file to edit.",
        },
        update: {
          type: "string",
          description:
            "The updated file content. For partial edits, use {{ ... }} placeholders for unchanged code. For complete rewrites, provide the entire file content without placeholders.",
        },
      },
      required: ["editFilePath", "update"],
    },
  },
};

export { editFileTool };
