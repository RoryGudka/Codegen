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
        "Convert this project to typescript. Verify by running build successfully and seeing no remaining .js files.",
    });

    // Run the assistant
    let stream = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      stream: true,
    });

    // Wait for completion and stream the response
    await handlePrimaryAssistantStream(stream, assistant.id);

    // Clean up - delete the assistant
    await openai.beta.assistants.del(assistant.id);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
