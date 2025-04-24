import { ChatCompletionTool } from "openai/resources/chat/index";

const diffHistoryTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "diffHistory",
    description:
      "Retrieve the history of recent changes made to files in the workspace. This tool helps understand what modifications were made recently, providing information about which files were changed, when they were changed, and how many lines were added or removed.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

export { diffHistoryTool };
