import { ChatCompletionTool } from "openai/resources/chat/index";

const editFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "editFile",
    description:
      "Edits a file by applying a series of code replacements or insertions specified by line ranges.",
    parameters: {
      type: "object",
      properties: {
        editFilePath: {
          type: "string",
          description: "The path to the file to edit.",
        },
        edits: {
          type: "array",
          description:
            "An array of edit objects specifying line ranges and new content. Lines are one-based. Use isInsertion: true for insertions before a line, or isInsertion: false (or omit) for replacements.",
          items: {
            type: "object",
            properties: {
              startLine: {
                type: "number",
                description:
                  "The starting line number (inclusive, one-based). For insertions (isInsertion: true), content is inserted before this line; endLine must equal startLine.",
              },
              endLine: {
                type: "number",
                description:
                  "The ending line number (inclusive, one-based). For replacements (isInsertion: false), specifies the last line to replace. For insertions (isInsertion: true), must equal startLine.",
              },
              newContent: {
                type: "string",
                description:
                  "The new content to replace the specified lines or insert at the specified position. Use empty string for deletions (isInsertion: false).",
              },
              isInsertion: {
                type: "boolean",
                description:
                  "If true, inserts newContent before startLine (endLine must equal startLine). If false or omitted, replaces lines from startLine to endLine. Defaults to false.",
                default: false,
              },
            },
            required: ["startLine", "endLine", "newContent"],
          },
        },
      },
      required: ["editFilePath", "edits"],
    },
  },
};

export { editFileTool };
