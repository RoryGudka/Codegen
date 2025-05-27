import { ChatCompletionTool } from "openai/resources/chat/index";

const editFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "editFile",
    description:
      "Edits an existing file. Provide the `update` as a representation of the desired file content.\n- Use `{{ ... }}` on a line by itself to represent sections of unchanged code from the original file. The tool will use a diff algorithm to intelligently merge your changes.\n- Specify the new or modified lines of code directly.\n- Lines from the original file that are not covered by your `update` (either by new code or a `{{ ... }}` placeholder) will be deleted.\n- Aim to provide enough context around your changes for accurate merging.\n\nExample of editing two separate parts of a file:\n```\n{{ ... }}\nnew_or_edited_line_1\nnew_or_edited_line_2\n{{ ... }}\nanother_edited_line_3\n{{ ... }}\n```\nThis indicates that the code before the first edit, between the edits, and after the second edit should be preserved from the original file.",
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
