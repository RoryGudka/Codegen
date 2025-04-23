import { ChatCompletion } from "openai/resources";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/index";
import { handleAssistantStream } from "./handleAssistantStream";
import { toolHandlers } from "../assistant/toolHandlers";

/**
 * Handles a tool call from the assistant stream
 * @param {Object} toolCall - The tool call object from the stream
 * @returns {Promise<any>} - Result of the tool execution
 */
async function handleToolCall(toolCall: RequiredActionFunctionToolCall) {
  const { function: func } = toolCall;
  const toolHandler = toolHandlers[func.name as keyof typeof toolHandlers];

  if (!toolHandler) {
    throw new Error(`Tool function ${func.name} not found`);
  }

  try {
    const args = JSON.parse(func.arguments);
    return await toolHandler(args);
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
async function handlePrimaryAssistantStream(
  output: ChatCompletion,
  id: string
) {
  return handleAssistantStream(output, id, handleToolCall);
}

export { handlePrimaryAssistantStream };
