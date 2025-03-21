"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editContextFileTool = void 0;
exports.editContextFileTool = {
    type: "function",
    function: {
        name: "editContextFile",
        description: "Modifies the codebase context file to save information between requests",
        parameters: {
            type: "object",
            properties: {
                update: {
                    type: "string",
                    description: "Update request for the context file",
                },
            },
            required: ["update"],
        },
    },
};
