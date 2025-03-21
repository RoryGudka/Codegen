const editFileTool = {
  type: "function",
  function: {
    name: "editFile",
    description: "",
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
        editFilePath: {
          type: "string",
          description: "The path to the file to edit",
        },
        instructions: {
          type: "string",
          description: "How this file should be edited",
        },
      },
      required: ["editFilePath", "instructions"],
    },
  },
};

module.exports = {
  editFileTool,
};
