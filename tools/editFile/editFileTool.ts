import { ChatCompletionTool } from "openai/resources/chat/index";

const editFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "editFile",
    description:
      "Use this tool to edit an existing file using multiple intelligent strategies. The system automatically selects the best approach based on your input format:\n\n" +
      "**Strategy 1 - Line-based edits (most precise):**\n" +
      "Use comments to specify exact line ranges, then provide the replacement content:\n" +
      "```\n// Lines 10-15:\nnew content here\nmore content\n\n// Lines 25:\nsingle line replacement\n```\n\n" +
      "**Strategy 2 - Enhanced placeholder-based edits:**\n" +
      "Use {{ ... }} placeholders to represent unchanged code with improved context matching:\n" +
      "```\n{{ ... }}\nchanged_line_1\n{{ ... }}\nchanged_line_2\n{{ ... }}\n```\n\n" +
      "**Strategy 3 - Context-based edits:**\n" +
      "Provide enough surrounding context lines for the system to intelligently locate and replace code sections.\n\n" +
      "**Strategy 4 - Complete file replacement:**\n" +
      "For major changes, provide the entire file content without any placeholders.\n\n" +
      "The system includes intelligent fallbacks and enhanced error recovery, significantly reducing the need for manual file rewrites.",
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
            "The content to apply to the file. Can use line-based comments (// Lines X-Y:), placeholder format ({{ ... }}), context-based edits, or complete file content.",
        },
      },
      required: ["editFilePath", "update"],
    },
  },
};

export { editFileTool };
