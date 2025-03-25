const searchFilesForKeywordTool = {
  type: "function",
  function: {
    name: "searchFilesForKeyword",
    description:
      "Searches file paths and contents for instances of a given keyword.",
    parameters: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          description: "The keyword to search for",
        },
      },
      required: ["keyword"],
    },
  },
};

module.exports = {
  searchFilesForKeywordTool,
};
