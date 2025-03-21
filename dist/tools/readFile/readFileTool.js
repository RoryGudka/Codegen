"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileTool = void 0;
const readFileTool = {
    type: "function",
    function: {
        name: "readFile",
        description: "Reads the contents of a file. Returns an error message if the file does not exist.",
        parameters: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                    description: "The path of the file to read",
                },
            },
            required: ["filePath"],
        },
    },
};
exports.readFileTool = readFileTool;
