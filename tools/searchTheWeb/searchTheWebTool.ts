import { ChatCompletionTool } from "openai/resources/chat/index";

const searchTheWebTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "searchTheWeb",
    description:
      "Search the web for real-time information about any topic. Use this tool when you need up-to-date information that might not be available in your training data, or when you need to verify current facts. The search results will include relevant snippets and URLs from web pages. This is particularly useful for questions about current events, technology updates, or any topic that requires recent information.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "The search query to look up on the web. Be specific and include relevant keywords for better results. For technical queries, include version numbers or dates if relevant.",
        },
      },
      required: ["query"],
    },
  },
};

export { searchTheWebTool };
