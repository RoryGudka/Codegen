const execTool = {
  type: "function",
  function: {
    name: "exec",
    description: "Executes a terminal command and returns the output or error.",
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "The terminal command to execute",
        },
      },
      required: ["command"],
    },
  },
};

module.exports = { execTool };
