const fs = require("fs");
const path = require("path");
const { openai } = require("../clients/openai");

/**
 * Streams an assistant's response to a file in the outputs directory
 * @param {AsyncIterable<any>} stream - The assistant's response stream
 * @param {string} id - Unique identifier for the output file
 * @param {Function} handleToolCall - Optional function to handle tool calls
 * @returns {Promise<string>} - Total content of stream output
 */
async function handleAssistantStream(stream, id, handleToolCall = null) {
  // Create outputs directory if it doesn't exist
  const outputsDir = path.join(process.cwd(), "outputs");
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
            if (content.text && content.text.value) {
              writeStream.write(content.text.value);
              str += content.text.value;
            }
          }
        }
      } else if (chunk.event === "thread.run.created") {
        currentRunId = chunk.data.id;
      } else if (
        chunk.event === "thread.run.requires_action" &&
        handleToolCall
      ) {
        const toolCalls =
          chunk.data.required_action.submit_tool_outputs.tool_calls;
        const results = [];

        for (const toolCall of toolCalls) {
          writeStream.write(
            `\n[Tool Call Arguments: ${toolCall.function.name}]\n`
          );
          writeStream.write(
            JSON.stringify(JSON.parse(toolCall.function.arguments), null, 2)
          );
          writeStream.write("\n");

          const result = await handleToolCall(toolCall);

          writeStream.write(
            `\n[Tool Call Result: ${toolCall.function.name}]\n`
          );
          writeStream.write(JSON.stringify(result, null, 2));
          writeStream.write("\n");

          results.push([toolCall.id, result]);
        }

        const newStream = await openai.beta.threads.runs.submitToolOutputs(
          chunk.data.thread_id,
          chunk.data.id,
          {
            tool_outputs: results.map(([id, response]) => ({
              tool_call_id: id,
              output:
                typeof response === "object"
                  ? JSON.stringify(response, null, 2)
                  : response.toString(),
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

module.exports = { handleAssistantStream };
