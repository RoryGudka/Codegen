const {
  handlePrimaryAssistantStream,
} = require("./helpers/handlePrimaryAssistantStream");
const { createAssistant } = require("./assistant/createAssistant");
const { openai } = require("./clients/openai");

async function main() {
  try {
    // Create a new assistant
    const assistant = await createAssistant();

    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content:
        "Add a endTask tool that accepts a isSuccess parameter and enacts process.exit(0) or process.exit(1) accordingly. Then Modify init.js to prompt the assistant to either continue with completing the request or use the endTask tool whenever it returns.",
    });

    // Max continue prompts is 5 to prevent infinite looping in worst case
    for (let i = 0; i < 5; i++) {
      // Run the assistant
      let stream = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        stream: true,
      });

      // Wait for completion and stream the response
      await handlePrimaryAssistantStream(stream, assistant.id);

      // Prompt the assistant to continue or end
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content:
          "Continue the task. If all changes are made and validated, use the endTask tool to exit.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
