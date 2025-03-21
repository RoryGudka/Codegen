const askFileQuestionTool = {
  type: "function",
  function: {
    name: "askFileQuestion",
    description: "Analyzes specific files to answer a given question",
    parameters: {
      type: "object",
      properties: {
        paths: {
          type: "array",
          items: {
            type: "string",
            description: "Input file path",
          },
          description: "The paths to the files to ask a question about",
        },
        question: {
          type: "string",
          description: "The question to ask about the files",
        },
      },
      required: ["paths", "question"],
    },
  },
};

module.exports = {
  askFileQuestionTool,
};
