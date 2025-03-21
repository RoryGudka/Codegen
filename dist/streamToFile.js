"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToFile = streamToFile;
exports.handleToolCall = handleToolCall;
const askCodebaseQuestionHandler_1 = require("./tools/askCodebaseQuestion/askCodebaseQuestionHandler");
const askFileQuestionHandler_1 = require("./tools/askFileQuestion/askFileQuestionHandler");
const createFileHandler_1 = require("./tools/createFile/createFileHandler");
const editContextFileHandler_1 = require("./tools/editContextFile/editContextFileHandler");
const editFileHandler_1 = require("./tools/editFile/editFileHandler");
const streamHelper_1 = require("./streamHelper");
const toolFunctions = {
    editFile: editFileHandler_1.editFileHandler,
    createFile: createFileHandler_1.createFileHandler,
    editContextFile: editContextFileHandler_1.editContextFileHandler,
    askCodebaseQuestion: askCodebaseQuestionHandler_1.askCodebaseQuestionHandler,
    askFileQuestion: askFileQuestionHandler_1.askFileQuestionHandler,
};
/**
 * Handles a tool call from the assistant stream
 * @param toolCall - The tool call object from the stream
 * @returns Result of the tool execution
 */
async function handleToolCall(toolCall) {
    const { function: func, id } = toolCall;
    const toolFunction = toolFunctions[func.name];
    if (!toolFunction) {
        throw new Error(`Tool function ${func.name} not found`);
    }
    try {
        const args = JSON.parse(func.arguments);
        return await toolFunction(args);
    }
    catch (error) {
        console.error(`Error executing tool ${func.name}:`, error);
        throw error;
    }
}
/**
 * Streams an assistant's response to a file in the outputs directory
 * @param stream - The assistant's response stream
 * @param id - Unique identifier for the output file
 * @returns Total content of stream output
 */
async function streamToFile(stream, id) {
    return (0, streamHelper_1.handleAssistantStream)(stream, id, handleToolCall);
}
