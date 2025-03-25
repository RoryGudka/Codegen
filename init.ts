import { createAssistant } from "./assistant/createAssistant";
import { handlePrimaryAssistantStream } from "./helpers/handlePrimaryAssistantStream";
import { openai } from "./clients/openai";

async function main(): Promise<void> {
  try {
    // Create a new assistant
    const assistant = await createAssistant();
    if (!assistant) {
      throw new Error("Failed to create assistant");
    }

    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content:
        "Add a helper to get all lint errors in the codebase. Then add it to createAssistant to inform the assistant of the current lint errors at the beginning of the conversation.",
    });

    // Max continue prompts is 5 to prevent infinite looping in worst case
    for (let i = 0; i < 5; i++) {
      // Run the assistant
      const stream = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        stream: true,
      });

      // Wait for completion and stream the response
      await handlePrimaryAssistantStream(stream, assistant.id);

      // Prompt the assistant to continue or end
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

main().catch(console.error);
