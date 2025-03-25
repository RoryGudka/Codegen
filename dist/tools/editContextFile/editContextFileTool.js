"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editContextFileTool = void 0;
const editContextFileTool = {
    type: "function",
    function: {
        name: "editContextFile",
        description: "Modifies the codebase context file to save information between requests.",
        parameters: {
            type: "object",
            properties: {
                content: {
                    type: "string",
                    description: "The new content of the context file",
                },
            },
            required: ["content"],
        },
    },
};
exports.editContextFileTool = editContextFileTool;
