import { MessageParam } from "@anthropic-ai/sdk/resources";
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
/**
 * Handles a tool call from the assistant stream
 * @param {Object} toolCall - The tool call object from the stream
 * @param {MessageParam[]} messages - The conversation messages for context
 * @returns {Promise<any>} - Result of the tool execution
 */
async function handleToolCall(toolCall: ToolCall, messages: MessageParam[]) {
  const { name, input } = toolCall;
  const toolHandler = toolHandlers[name as keyof typeof toolHandlers];

  if (!toolHandler) {
    throw new Error(`Tool function ${name} not found`);
  }

  try {
    const args = JSON.parse(input);
    // Pass messages to the tool handler for tools that need context
    return await toolHandler(args, messages);
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error);
    throw error;
  }
}

export { handleToolCall };
