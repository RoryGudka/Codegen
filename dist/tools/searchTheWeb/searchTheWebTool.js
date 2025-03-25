"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTheWebTool = void 0;
const searchTheWebTool = {
    type: "function",
    function: {
        name: "searchTheWeb",
        description: "Performs a web search with a given query.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The search query",
                },
            },
            required: ["query"],
        },
    },
};
exports.searchTheWebTool = searchTheWebTool;
