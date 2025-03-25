import { createAssistant } from "./assistant/createAssistant";
import { handlePrimaryAssistantStream } from "./helpers/handlePrimaryAssistantStream";
import { openai } from "./clients/openai";

async function main(userInput: string): Promise<void> {
  try {
    // Log the user input to verify CLI string argument is passed
    console.log("User input:", userInput);

    // Proceed with the rest of the current logic
    const assistant = await createAssistant();
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

      await handlePrimaryAssistantStream(stream, assistant.id);

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

const userInput = process.argv.slice(2).join(" ");
main(userInput).catch(console.error);
