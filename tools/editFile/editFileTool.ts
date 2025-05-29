import { ChatCompletionTool } from "openai/resources/chat/index";

const editFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "editFile",
    description:
      "Use this tool to edit an existing file using search and replace blocks. Each edit should be specified using the following format:\n\n<<<<<<< SEARCH\n(exact code to search for)\n=======\n(replacement code)\n>>>>>>> REPLACE\n\nFor example:\n<<<<<<< SEARCH\nfunction oldFunction() {\n  return 'old';\n}\n=======\nfunction newFunction() {\n  return 'new';\n}\n>>>>>>> REPLACE\n\nMultiple search/replace blocks can be included in a single update; simply place another search and replace block after the other with a newline character in between. Your search should exactly match the original code you're editing, and should be unique in order to resolve properly. Do not omit whitespace.",
    parameters: {
      type: "object",
      properties: {
        editFilePath: {
          type: "string",
          description: "The path to the file to edit.",
        },
        update: {
          type: "string",
          description:
            "A string containing one or more search/replace blocks in the specified format.",
        },
        description: {
          type: "string",
          description:
            "A clear description of the changes you want to make to the file. Be specific about what needs to be modified, added, or removed.",
        },
      },
      required: ["editFilePath", "update", "description"],
    },
  },
};

export { editFileTool };
