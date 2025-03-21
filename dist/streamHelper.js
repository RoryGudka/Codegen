"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = void 0;
exports.handleAssistantStream = handleAssistantStream;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
// Initialize OpenAI client
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
exports.openai = openai;
/**
 * Streams an assistant's response to a file in the outputs directory
 * @param {AsyncIterable<any>} stream - The assistant's response stream
 * @param {string} id - Unique identifier for the output file
 * @param {HandleToolCallFunction} handleToolCall - Optional function to handle tool calls
 * @returns {Promise<string>} - Total content of stream output
 */
async function handleAssistantStream(stream, id, handleToolCall = null) {
    // Create outputs directory if it doesn't exist
    const outputsDir = path_1.default.join(process.cwd(), "outputs");
    if (!fs_1.default.existsSync(outputsDir)) {
        fs_1.default.mkdirSync(outputsDir, { recursive: true });
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Create output file path
    const outputPath = path_1.default.join(outputsDir, `output-${id}.txt`);
    const writeStream = fs_1.default.createWriteStream(outputPath, { flags: "a" });
    let str = "";
    let currentRunId = "";
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
            }
            else if (chunk.event === "thread.run.created") {
                currentRunId = chunk.data.id;
            }
            else if (chunk.event === "thread.run.requires_action" &&
                handleToolCall) {
                const toolCalls = chunk.data.required_action.submit_tool_outputs.tool_calls;
                const results = [];
                for (const toolCall of toolCalls) {
                    writeStream.write(`\n[Tool Call Arguments: ${toolCall.function.name}]\n`);
                    writeStream.write(JSON.stringify(JSON.parse(toolCall.function.arguments), null, 2));
                    writeStream.write("\n");
                    const result = await handleToolCall(toolCall);
                    writeStream.write(`\n[Tool Call Result: ${toolCall.function.name}]\n`);
                    writeStream.write(JSON.stringify(result, null, 2));
                    writeStream.write("\n");
                    results.push([toolCall.id, result]);
                }
                const newStream = await openai.beta.threads.runs.submitToolOutputs(chunk.data.thread_id, chunk.data.id, {
                    tool_outputs: results.map(([id, response]) => ({
                        tool_call_id: id,
                        output: typeof response === "object"
                            ? JSON.stringify(response)
                            : response.toString(),
                    })),
                    stream: true,
                });
                const additionalContent = await handleAssistantStream(newStream, id, handleToolCall);
                str += additionalContent;
            }
        }
    }
    catch (error) {
        console.error("Error while streaming:", error);
        throw error;
    }
    finally {
        writeStream.end();
    }
    return str;
}
