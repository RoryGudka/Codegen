const { handleAssistantStream } = require("./handleAssistantStream");
const { toolFunctions } = require("../assistant/toolFunctions");

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
async function handlePrimaryAssistantStream(stream, id) {
  return handleAssistantStream(stream, id, handleToolCall);
}

module.exports = { handlePrimaryAssistantStream };
