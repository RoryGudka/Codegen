import { toolHandlers } from "../assistant/toolHandlers";

export interface ToolCall {
  id: string;
  name: string;
  input: string;
}
/**
 * Handles a tool call from the assistant stream
 * @param {Object} toolCall - The tool call object from the stream
 * @returns {Promise<any>} - Result of the tool execution
 */
async function handleToolCall(toolCall: ToolCall) {
  const { name, input } = toolCall;
  const toolHandler = toolHandlers[name as keyof typeof toolHandlers];

  if (!toolHandler) {
    throw new Error(`Tool function ${name} not found`);
  }

  try {
    const args = JSON.parse(input);
    return await toolHandler(args);
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error);
    throw error;
  }
}

export { handleToolCall };
