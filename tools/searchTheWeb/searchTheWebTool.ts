import { ChatCompletionTool } from "openai/resources/chat/index";

const searchTheWebTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "searchTheWeb",
    description: "Performs a web search with a given query.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
      },
      required: ["query"],
    },
  },
};

export { searchTheWebTool };
