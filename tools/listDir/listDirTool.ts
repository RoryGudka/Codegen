import { ChatCompletionTool } from "openai/resources/chat/index";

const listDirTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "listDir",
    description:
      "List the contents of a directory. The quick tool to use for discovery, before using more targeted tools like semantic search or file reading. Useful to try to understand the file structure before diving deeper into specific files. Can be used to explore the codebase.",
    parameters: {
      properties: {
        relativeWorkspacePath: {
          description:
            "Path to list contents of, relative to the workspace root.",
          type: "string",
        },
      },
      required: ["relativeWorkspacePath"],
      type: "object",
    },
  },
};

export { listDirTool };
