import { createOpenAIStream } from "../assistant/createOpenAIStream";
import { getMostRelevantFiles } from "../helpers/getEmbeddingSimilarity";
import { handleAssistantStream } from "../helpers/handleAssistantStream";
import { handleToolCall } from "../helpers/handleToolCall";
import { openai } from "../clients/openai";

export async function generateWithOpenAi(userInput: string, n: number) {
  try {
    const files = await getMostRelevantFiles(userInput, n);

    const { assistant, id } = await createOpenAIStream(files);
    if (!assistant) {
      throw new Error("Failed to create assistant");
    }

    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userInput, // Use the input as the first message content
    });

    // Max continue prompts is 5 to prevent infinite looping in worst case
    for (let i = 0; i < 5; i++) {
      const stream = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        stream: true,
      });

      await handleAssistantStream(stream, id, handleToolCall);

      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content:
          "Continue the task. If all changes are made and validated, you must use the endTask tool to exit.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
