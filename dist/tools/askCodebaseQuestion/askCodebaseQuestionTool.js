"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askCodebaseQuestionTool = exports.askCodebaseQuestion = void 0;
const askCodebaseQuestion = (directories, question) => {
    // Implementation for analyzing specified directories to answer the question
};
exports.askCodebaseQuestion = askCodebaseQuestion;
const askCodebaseQuestionTool = {
    type: "function",
    function: {
        name: "askCodebaseQuestion",
        description: "Analyzes specified directories within the codebase to answer a given question",
        parameters: {
            type: "object",
            properties: {
                directories: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                    description: "An array of directory paths to analyze",
                },
                question: {
                    type: "string",
                    description: "The question pertaining to the entire codebase",
                },
            },
            required: ["directories", "question"],
        },
    },
};
exports.askCodebaseQuestionTool = askCodebaseQuestionTool;
