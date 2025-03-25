import { ChatCompletionTool } from "openai/resources/chat/index";

const endTaskTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "endTask",
    description:
      "Ends the task completion loop, marking it as either successful or unsuccessful.",
    parameters: {
      type: "object",
      properties: {
        isSuccess: {
          type: "boolean",
          description:
            "Whether the task was completed and validated successfully",
        },
      },
      required: ["isSuccess"],
    },
  },
};

export { endTaskTool };
