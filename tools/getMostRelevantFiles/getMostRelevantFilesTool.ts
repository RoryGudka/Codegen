import { ChatCompletionTool } from "openai/resources/chat/index";

const getMostRelevantFilesTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "getMostRelevantFiles",
    description:
      "Retrieves the top n most relevant files based on a given input string and codebase embeddings.",
    parameters: {
      type: "object",
      properties: {
        inputString: {
          type: "string",
          description: "The string to find relevant files for, based on embeddings.",
        },
        n: {
          type: "number",
          description: "The number of top relevant files to retrieve.",
        },
      },
      required: ["inputString", "n"],
    },
  },
};

export { getMostRelevantFilesTool };
