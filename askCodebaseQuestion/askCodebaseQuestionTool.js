const askCodebaseQuestionTool = {
  type: "function",
  function: {
    name: "askCodebaseQuestion",
    description: "Analyzes the entire codebase to answer a given question",
    parameters: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description: "The question to answer",
        },
      },
      required: ["question"],
    },
  },
};

module.exports = {
  askCodebaseQuestionTool,
};
