import { MessageParam } from "@anthropic-ai/sdk/resources";
import { createAnthropicStream } from "../assistant/createAnthropicStream";
import { getMostRelevantFiles } from "./getEmbeddingSimilarity";
import { handleAnthropicStream } from "./handleAnthropicStream";
import { handleToolCall } from "./handleToolCall";

export async function generateWithAnthropic(userInput: string, n: number) {
  try {
    const messages: MessageParam[] = [{ role: "user", content: userInput }];
    const files = await getMostRelevantFiles(userInput, n);

    const { stream, id } = await createAnthropicStream(files, messages);
    await handleAnthropicStream(stream, id, files, messages, handleToolCall);

    // Max continue prompts is 5 to prevent infinite looping in worst case
    for (let i = 0; i < 5; i++) {
      messages.push({
        role: "user",
        content:
          "Continue the task. If all changes are made and validated, you must use the endTask tool to exit.",
      });

      const { stream } = await createAnthropicStream(files, messages);
      await handleAnthropicStream(stream, id, files, messages, handleToolCall);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
