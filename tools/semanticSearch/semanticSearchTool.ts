import { ChatCompletionTool } from "openai/resources/chat/index";

const semanticSearchTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "semanticSearch",
    description:
      "Find snippets of code from the codebase most relevant to the search query.\nThis is a semantic search tool, so the query should ask for something semantically matching what is needed.\nUnless there is a clear reason to use your own search query, please just reuse the user's exact query with their wording.\nTheir exact wording/phrasing can often be helpful for the semantic search query. Keeping the same exact question format can also be helpful.",
    parameters: {
      properties: {
        query: {
          description:
            "The search query to find relevant code. You should reuse the user's exact query/most recent message with their wording unless there is a clear reason not to.",
          type: "string",
        },
      },
      required: ["query"],
      type: "object",
    },
  },
};

export { semanticSearchTool };
