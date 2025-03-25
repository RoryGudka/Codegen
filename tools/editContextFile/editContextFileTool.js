const editContextFileTool = {
  type: "function",
  function: {
    name: "editContextFile",
    description:
      "Modifies the codebase context file to save information between requests.",
    parameters: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "The new content of the context file",
        },
      },
      required: ["content"],
    },
  },
};

module.exports = {
  editContextFileTool,
};
