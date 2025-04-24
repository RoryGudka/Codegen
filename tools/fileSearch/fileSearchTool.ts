import { ChatCompletionTool } from "openai/resources/chat/index";

const fileSearchTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "fileSearch",
    description:
      "Fast file search based on fuzzy matching against file path. Use if you know part of the file path but don't know where it's located exactly. Response will be capped to 10 results. Make your query more specific if need to filter results further.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Fuzzy filename to search for",
        },
      },
      required: ["query"],
    },
  },
};

export { fileSearchTool };
