const editContextFileTool = {
  type: "function",
  function: {
    name: "editContextFile",
    description:
      "Modifies the codebase context file to save information between requests",
    parameters: {
      type: "object",
      properties: {
        information: {
          type: "string",
          description: "Information to save to the context file",
        },
      },
      required: ["information"],
    },
  },
};

module.exports = {
  editContextFileTool,
};
