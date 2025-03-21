interface AskCodebaseQuestionParams {
  directories: string[];
  question: string;
}

const askCodebaseQuestion = (directories: string[], question: string): void => {
  // Implementation for analyzing specified directories to answer the question
};

const askCodebaseQuestionTool = {
  type: "function" as const,
  function: {
    name: "askCodebaseQuestion",
    description:
      "Analyzes specified directories within the codebase to answer a given question",
    parameters: {
      type: "object",
      properties: {
        directories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of directory paths to analyze",
        },
        question: {
          type: "string",
          description: "The question pertaining to the entire codebase",
        },
      },
      required: ["directories", "question"],
    },
  },
} as const;

export {
  askCodebaseQuestion,
  askCodebaseQuestionTool,
  AskCodebaseQuestionParams,
};
