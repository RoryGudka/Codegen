import { ChatCompletionTool } from "openai/resources/chat/index";

const searchFilesForKeywordTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "searchFilesForKeyword",
    description:
      "Searches file paths and contents for instances of a given keyword.",
    parameters: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          description: "The keyword to search for",
        },
      },
      required: ["keyword"],
    },
  },
};

export { searchFilesForKeywordTool };
