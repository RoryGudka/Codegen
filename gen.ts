import { client } from "./clients/ai";
import { createAssistant } from "./assistant/createAssistant";
import { getMostRelevantFiles } from "./helpers/getEmbeddingSimilarity";
import { handlePrimaryAssistantStream } from "./helpers/handlePrimaryAssistantStream";

export async function gen(userInput: string, n: number) {
  try {
    const files = await getMostRelevantFiles(userInput, n);

    const assistant = await createAssistant(files);
    if (!assistant) {
      throw new Error("Failed to create assistant");
    }

    const thread = await client.beta.threads.create();
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userInput, // Use the input as the first message content
    });

    // Max continue prompts is 5 to prevent infinite looping in worst case
    for (let i = 0; i < 5; i++) {
      const stream = await client.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        stream: true,
      });

      await handlePrimaryAssistantStream(stream, assistant.id);

      await client.beta.threads.messages.create(thread.id, {
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
