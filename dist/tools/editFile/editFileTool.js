"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editFileTool = void 0;
const editFileTool = {
    type: "function",
    function: {
        name: "editFile",
        description: "Edits a file with the given instructions and context files. Returns an error message if the file does not exist.",
        parameters: {
            type: "object",
            properties: {
                editFilePath: {
                    type: "string",
                    description: "The path to the file to edit",
                },
                content: {
                    type: "string",
                    description: "The new file content",
                },
            },
            required: ["editFilePath", "content"],
        },
    },
};
exports.editFileTool = editFileTool;
