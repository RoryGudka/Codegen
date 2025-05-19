import { ChatCompletionTool } from "openai/resources/chat/index";

const editFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "editFile",
    description:
      "Use this tool to edit an existing file. Specify ONLY the precise lines of code that you wish to edit. NEVER specify or write out unchanged code. Instead, represent all unchanged code using this special placeholder: {{ ... }}. To edit multiple, non-adjacent lines of code in the same file, make a single call to this tool. Specify each edit in sequence with the special placeholder {{ ... }} to represent unchanged code in between edited lines.Here's an example of how to edit three non-adjacent lines of code at once:\n{{ ... }}\nedited_line_1\n{{ ... }}\nedited_line_2\n{{ ... }}\nedited_line_3\n{{ ... }}\nThis will be compared against the original file content using patience diff to replace all placeholders with their corresponding unchanged code. You should minimize the unchanged code you write, but each edit should contain sufficient context of unchanged lines around the code you're editing to resolve ambiguity. DO NOT omit spans of pre-existing code (or comments) without using the {{ ... }} placeholder to indicate its absence. ALWAYS make sure to start and end your edit with the {{ ... }} placeholder, unless your edit includes the first and/or the last lines of code for the file. If you omit the placeholder, the diff algorithm may inadvertently delete these lines.",
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
            "A string containing the updated file content, with special placeholder {{ ... }} to represent unchanged code in between edits.",
        },
      },
      required: ["editFilePath", "update"],
    },
  },
};

export { editFileTool };
