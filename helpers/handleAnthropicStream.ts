import {
  MessageParam,
  RawMessageStreamEvent,
} from "@anthropic-ai/sdk/resources";

import { Stream } from "@anthropic-ai/sdk/streaming";
import { ToolCall } from "./handleToolCall";
import { createAnthropicStream } from "../assistant/createAnthropicStream";
import fs from "fs";
import path from "path";

/**
 * Streams an assistant's response to a file in the outputs directory
 * @param {AsyncIterable<any>} stream - The assistant's response stream
 * @param {string} id - Unique identifier for the output file
 * @param {Function} handleToolCall - Optional function to handle tool calls
 * @returns {Promise<string>} - Total content of stream output
 */
async function handleAnthropicStream(
  stream: Stream<RawMessageStreamEvent> & { _request_id?: string | null },
  id: string,
  files: [string, string][],
  messages: MessageParam[],
  handleToolCall: (toolCall: ToolCall) => Promise<string>
) {
  const outputsDir = path.join(process.cwd(), ".codegen/outputs");
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Create output file path
  const outputPath = path.join(outputsDir, `output-${id}.txt`);
  const writeStream = fs.createWriteStream(outputPath, { flags: "a" });
  let str = "";
  let type = "";
  let toolCallId = "";
  let toolCallName = "";
  const toolCalls = [];

  try {
    for await (const chunk of stream) {
      if (chunk.type === "content_block_start") {
        type = chunk.content_block.type;
        if (chunk.content_block.type === "tool_use") {
          toolCallId = chunk.content_block.id;
          toolCallName = chunk.content_block.name;

          writeStream.write(`\n[Tool Call Arguments: ${toolCallName}]\n`);
        }
      } else if (chunk.type === "content_block_delta") {
        const { delta } = chunk;
        if (delta.type === "text_delta") {
          writeStream.write(delta.text);
          str += delta.text;
        } else if (delta.type === "input_json_delta") {
          str += delta.partial_json;
        }
      } else if (chunk.type === "content_block_stop") {
        if (type === "text") {
          messages.push({ role: "assistant", content: str });
        } else if (type === "tool_use") {
          const toolCall: ToolCall = {
            id: toolCallId,
            name: toolCallName,
            input: str,
          };
          toolCalls.push(toolCall);
        }

        str = "";
      }
    }

    if (toolCalls.length) {
      for (const toolCall of toolCalls) {
        messages.push({
          role: "assistant",
          content: [
            {
              type: "tool_use",
              id: toolCall.id,
              name: toolCall.name,
              input: JSON.parse(toolCall.input),
            },
          ],
        });

        const result = await handleToolCall(toolCall);
        console.log(result);

        writeStream.write(`\n[Tool Call: ${toolCall.name}]\n\n`);
        writeStream.write(JSON.stringify(JSON.parse(toolCall.input), null, 2));
        writeStream.write(`\n\n${result}\n`);

        messages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolCall.id,
              content: result,
            },
          ],
        });
      }

      const { stream } = await createAnthropicStream(files, messages);
      await handleAnthropicStream(stream, id, files, messages, handleToolCall);
    }
  } catch (error) {
    console.error("Error while streaming:", error);
    throw error;
  } finally {
    writeStream.end();
  }
}

export { handleAnthropicStream };
