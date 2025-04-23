import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources";

import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/index";
import fs from "fs";
import path from "path";

/**
 * Streams an assistant's response to a file in the outputs directory
 * @param {AsyncIterable<any>} stream - The assistant's response stream
 * @param {string} id - Unique identifier for the output file
 * @param {Function} handleToolCall - Optional function to handle tool calls
 * @returns {Promise<string>} - Total content of stream output
 */
async function handleAssistantStream(
  output: ChatCompletion,
  id: string,
  handleToolCall: (toolCall: RequiredActionFunctionToolCall) => Promise<string>
) {
  const newMessages: ChatCompletionMessageParam[] = [];

  const outputsDir = path.join(process.cwd(), ".codegen/outputs");
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Create output file path
  const outputPath = path.join(outputsDir, `output-${id}.txt`);
  const writeStream = fs.createWriteStream(outputPath, { flags: "a" });

  try {
    const message = output.choices[0].message;
    if (message?.tool_calls) {
      for (const toolCall of message.tool_calls) {
        console.log(toolCall);
        writeStream.write(
          `\n[Tool Call Arguments: ${toolCall.function.name}]\n`
        );
        writeStream.write(
          JSON.stringify(JSON.parse(toolCall.function.arguments), null, 2)
        );
        writeStream.write("\n");

        const result = await handleToolCall(toolCall);
        newMessages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: toolCall.function.name,
          content: result,
        } as any);

        writeStream.write(`\n[Tool Call Result: ${toolCall.function.name}]\n`);
        writeStream.write(result);
        writeStream.write("\n");
      }
    } else if (message?.content) {
      newMessages.push({ role: "assistant", content: message.content });
      writeStream.write(message.content);
    }
  } catch (error) {
    console.error("Error while streaming:", error);
    throw error;
  } finally {
    writeStream.end();
  }

  return newMessages;
}

export { handleAssistantStream };
