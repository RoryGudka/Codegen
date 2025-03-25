"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execTool = void 0;
const execTool = {
    type: "function",
    function: {
        name: "exec",
        description: "Executes a terminal command and returns the output or error.",
        parameters: {
            type: "object",
            properties: {
                command: {
                    type: "string",
                    description: "The terminal command to execute",
                },
            },
            required: ["command"],
        },
    },
};
exports.execTool = execTool;
