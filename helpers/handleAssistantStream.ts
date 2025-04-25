import { AssistantStreamEvent } from "openai/resources/beta/assistants";
import { ToolCall } from "./handleToolCall";
import fs from "fs";
import { openai } from "../clients/openai";
import path from "path";

/**
 * Streams an assistant's response to a file in the outputs directory
 * @param {AsyncIterable<any>} stream - The assistant's response stream
 * @param {string} id - Unique identifier for the output file
 * @param {Function} handleToolCall - Optional function to handle tool calls
 * @returns {Promise<string>} - Total content of stream output
 */
async function handleAssistantStream(
  stream: AsyncIterable<AssistantStreamEvent>,
  id: string,
  handleToolCall: (toolCall: ToolCall) => Promise<string>
) {
  // Create outputs directory if it doesn't exist
  const outputsDir = path.join(process.cwd(), ".codegen/outputs");
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Create output file path
  const outputPath = path.join(outputsDir, `output-${id}.txt`);
  const writeStream = fs.createWriteStream(outputPath, { flags: "a" });

  let str = "";

  try {
    for await (const chunk of stream) {
      if (chunk.event === "thread.message.delta") {
        const { delta } = chunk.data;
        if (delta.content && Array.isArray(delta.content)) {
          for (const content of delta.content) {
            if (content.type === "text" && content.text && content.text.value) {
              writeStream.write(content.text.value);
              str += content.text.value;
            }
          }
        }
      } else if (
        chunk.event === "thread.run.requires_action" &&
        handleToolCall
      ) {
        const toolCalls =
          chunk.data.required_action?.submit_tool_outputs.tool_calls || [];
        const results: [string, string][] = [];

        for (const call of toolCalls) {
          const toolCall: ToolCall = {
            id: call.id,
            name: call.function.name,
            input: call.function.arguments,
          };

          writeStream.write(`\n[Tool Call Arguments: ${toolCall.name}]\n`);
          writeStream.write(
            JSON.stringify(JSON.parse(toolCall.input), null, 2)
          );
          writeStream.write("\n");

          const result = await handleToolCall(toolCall);

          writeStream.write(`\n[Tool Call Result: ${toolCall.name}]\n`);
          writeStream.write(result);
          writeStream.write("\n");

          results.push([toolCall.id, result]);
        }

        const newStream = await openai.beta.threads.runs.submitToolOutputs(
          chunk.data.thread_id,
          chunk.data.id,
          {
            tool_outputs: results.map(([id, response]) => ({
              tool_call_id: id,
              output: response,
            })),
            stream: true,
          }
        );
        const additionalContent = await handleAssistantStream(
          newStream,
          id,
          handleToolCall
        );
        str += additionalContent;
      }
    }
  } catch (error) {
    console.error("Error while streaming:", error);
    throw error;
  } finally {
    writeStream.end();
  }

  return str;
}

export { handleAssistantStream };
