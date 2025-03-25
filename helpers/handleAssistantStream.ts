import { AssistantRun } from "../types/openai";

/**
 * Streams an assistant's response to a file in the outputs directory
 * @param {AsyncIterable<any>} stream - The assistant's response stream
 * @param {string} id - Unique identifier for the output file
 * @param {Function} handleToolCall - Optional function to handle tool calls
 * @returns {Promise<string>} - Total content of stream output
 */
export async function handleAssistantStream(
  stream: AsyncIterable<any>,
  id: string,
  handleToolCall: ((toolCall: any) => Promise<void>) | null = null
): Promise<string> {
  let str = "";

  try {
    for await (const chunk of stream) {
      if (chunk.choices?.[0]?.delta?.content) {
        const content = chunk.choices[0].delta.content;
        str += content;
      }

      if (handleToolCall && chunk.choices?.[0]?.delta?.tool_calls) {
        await handleToolCall(chunk.choices[0].delta.tool_calls);
      }
    }
  } catch (error) {
    console.error("Error while streaming:", error);
    throw error;
  }

  return str;
}

module.exports = { handleAssistantStream };
