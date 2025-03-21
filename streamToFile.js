const { handleAssistantStream } = require("./streamHelper");
const { editFileHandler } = require("./tools/editFile/editFileHandler");
const {
  editContextFileHandler,
} = require("./tools/editContextFile/editContextFileHandler");
const {
  askCodebaseQuestionHandler,
} = require("./tools/askCodebaseQuestion/askCodebaseQuestionHandler");
const {
  askFileQuestionHandler,
} = require("./tools/askFileQuestion/askFileQuestionHandler");
const { createFileHandler } = require("./tools/createFile/createFileHandler");

const toolFunctions = {
  editFile: editFileHandler,
  createFile: createFileHandler,
  editContextFile: editContextFileHandler,
  askCodebaseQuestion: askCodebaseQuestionHandler,
  askFileQuestion: askFileQuestionHandler,
};

/**
 * Handles a tool call from the assistant stream
 * @param {Object} toolCall - The tool call object from the stream
 * @returns {Promise<any>} - Result of the tool execution
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
  } catch (error) {
    console.error(`Error executing tool ${func.name}:`, error);
    throw error;
  }
}

/**
 * Streams an assistant's response to a file in the outputs directory
 * @param {AsyncIterable<any>} stream - The assistant's response stream
 * @param {string} id - Unique identifier for the output file
 * @returns {Promise<string>} - Total content of stream output
 */
async function streamToFile(stream, id) {
  return handleAssistantStream(stream, id, handleToolCall);
}

module.exports = {
  streamToFile,
  handleToolCall,
};
