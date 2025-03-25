const createFileTool = {
  type: "function",
  function: {
    name: "createFile",
    description:
      "Creates a new file with the given content. Returns an error message if the file already exists.",
    parameters: {
      type: "object",
      properties: {
        newFilePath: {
          type: "string",
          description: "The path where the new file should be created",
        },
        content: {
          type: "string",
          description: "The new file content",
        },
      },
      required: ["newFilePath", "content"],
    },
  },
};

module.exports = {
  createFileTool,
};
