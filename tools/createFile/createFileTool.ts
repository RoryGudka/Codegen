import type { AssistantTool } from "../../types/openai";

interface CreateFileToolParameters {
  type: "object";
  properties: {
    contextFilePaths: {
      type: "array";
      items: {
        type: "string";
        description: string;
      };
      description: string;
    };
    newFilePath: {
      type: "string";
      description: string;
    };
    instructions: {
      type: "string";
      description: string;
    };
  };
  required: string[];
}

export const createFileTool: AssistantTool = {
  type: "function",
  function: {
    name: "createFile",
    description:
      "Creates a new file with the given instructions and context files. Throws an error if the file already exists.",
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
          description: "The path to the new file to create",
        },
        instructions: {
          type: "string",
          description: "How this file should be created",
        },
      },
      required: ["newFilePath", "instructions"],
    },
  },
};
