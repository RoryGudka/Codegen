"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askFileQuestionTool = void 0;
const askFileQuestionTool = {
    type: "function",
    function: {
        name: "askFileQuestion",
        description: "Analyzes specific files to answer a given question",
        parameters: {
            type: "object",
            properties: {
                filePaths: {
                    type: "array",
                    items: {
                        type: "string",
                        description: "Input file path",
                    },
                    description: "The paths to the files to ask a question about",
                },
                question: {
                    type: "string",
                    description: "The question to ask about the files",
                },
            },
            required: ["paths", "question"],
        },
    },
};
exports.askFileQuestionTool = askFileQuestionTool;
