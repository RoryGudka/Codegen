import { askCodebaseQuestionHandler } from "./tools/askCodebaseQuestion/askCodebaseQuestionHandler";
import { askFileQuestionHandler } from "./tools/askFileQuestion/askFileQuestionHandler";
import { createFileHandler } from "./tools/createFile/createFileHandler";
import { editContextFileHandler } from "./tools/editContextFile/editContextFileHandler";
import { editFileHandler } from "./tools/editFile/editFileHandler";
import { handleAssistantStream } from "./streamHelper";

interface ToolFunctions {
  [key: string]: (args: any) => Promise<any>;
}

const toolFunctions: ToolFunctions = {
  editFile: editFileHandler,
  createFile: createFileHandler,
  editContextFile: editContextFileHandler,
  askCodebaseQuestion: askCodebaseQuestionHandler,
  askFileQuestion: askFileQuestionHandler,
};

interface ToolCall {
  function: {
    name: string;
    arguments: string;
  };
  id: string;
}

/**
 * Handles a tool call from the assistant stream
 * @param toolCall - The tool call object from the stream
 * @returns Result of the tool execution
 */
async function handleToolCall(toolCall: ToolCall): Promise<any> {
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
 * @param stream - The assistant's response stream
 * @param id - Unique identifier for the output file
 * @returns Total content of stream output
 */
async function streamToFile(
  stream: AsyncIterable<any>,
  id: string
): Promise<string> {
  return handleAssistantStream(stream, id, handleToolCall);
}

export { streamToFile, handleToolCall, ToolCall, ToolFunctions };
