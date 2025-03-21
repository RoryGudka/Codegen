const createFileTool = {
  type: "function",
  function: {
    name: "createFile",
    description:
      "Creates a new file with the given content. Throws an error if the file already exists.",
    parameters: {
      type: "object",
      properties: {
        contextFilePaths: {
          type: "array",
          items: {
            type: "string",
            description: "An input file path",
          },
          description: "The paths to the files that should be used as context",
        },
        newFilePath: {
          type: "string",
          description: "The path where the new file should be created",
        },
        instructions: {
          type: "string",
          description:
            "Instructions for what content should be in the new file",
        },
      },
      required: ["newFilePath", "instructions"],
    },
  },
};

module.exports = {
  createFileTool,
};
