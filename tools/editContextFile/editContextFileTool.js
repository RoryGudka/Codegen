const editContextFileTool = {
  type: "function",
  function: {
    name: "editContextFile",
    description:
      "Modifies the codebase context file to save information between requests",
    parameters: {
      type: "object",
      properties: {
        update: {
          type: "string",
          description: "Update request for the context file",
        },
      },
      required: ["update"],
    },
  },
};

module.exports = {
  editContextFileTool,
};
