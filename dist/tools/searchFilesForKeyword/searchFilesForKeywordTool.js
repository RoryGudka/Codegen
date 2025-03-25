"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFilesForKeywordTool = void 0;
const searchFilesForKeywordTool = {
    type: "function",
    function: {
        name: "searchFilesForKeyword",
        description: "Searches file paths and contents for instances of a given keyword.",
        parameters: {
            type: "object",
            properties: {
                keyword: {
                    type: "string",
                    description: "The keyword to search for",
                },
            },
            required: ["keyword"],
        },
    },
};
exports.searchFilesForKeywordTool = searchFilesForKeywordTool;
