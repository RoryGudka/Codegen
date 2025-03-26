import { ChatCompletionTool } from "openai/resources/chat/index";

const getFilesSimilarToStringTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "getFilesSimilarToString",
    description:
      "Returns the top n files with embeddings most similar to the given string.",
    parameters: {
      type: "object",
      properties: {
        inputString: {
          type: "string",
          description: "The string to compare against the file embeddings.",
        },
        n: {
          type: "number",
          description: "The number of top similar files to return.",
        },
      },
      required: ["inputString", "n"],
    },
  },
};

export { getFilesSimilarToStringTool };