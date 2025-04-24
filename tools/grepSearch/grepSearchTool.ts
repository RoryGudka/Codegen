import { ChatCompletionTool } from "openai/resources/chat/index";

const grepSearchTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "grepSearch",
    description:
      "Fast text-based regex search that finds exact pattern matches within files or directories, utilizing the ripgrep command for efficient searching.\nResults will be formatted in the style of ripgrep and can be configured to include line numbers and content.\nTo avoid overwhelming output, the results are capped at 50 matches.\nUse the include or exclude patterns to filter the search scope by file type or specific paths.\n\nThis is best for finding exact text matches or regex patterns.\nMore precise than semantic search for finding specific strings or patterns.\nThis is preferred over semantic search when we know the exact symbol/function name/etc. to search in some set of directories/file types.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The regex pattern to search for",
        },
        caseSensitive: {
          type: "boolean",
          description: "Whether the search should be case sensitive",
        },
        includePattern: {
          type: "string",
          description:
            "Glob pattern for files to include (e.g. '*.ts' for TypeScript files)",
        },
        excludePattern: {
          type: "string",
          description: "Glob pattern for files to exclude",
        },
      },
      required: ["query"],
    },
  },
};

export { grepSearchTool };
