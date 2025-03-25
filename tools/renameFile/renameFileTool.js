const renameFileTool = {
  type: "function",
  function: {
    name: "renameFile",
    description:
      "Renames a file within the same directory. Returns an error message if the file does not exist. Returns an error message if newFileName includes path information.",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The current path of the file",
        },
        newFileName: {
          type: "string",
          description: "The new file name",
        },
      },
      required: ["filePath", "newFileName"],
    },
  },
};

module.exports = {
  renameFileTool,
};
