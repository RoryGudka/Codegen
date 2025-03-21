require("dotenv").config();
const OpenAI = require("openai");
const { streamToFile } = require("./streamToFile");
const { createAssistant } = require("./_primaryAssistant/createAssistant");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
        "Initialize the context file for the codebase with any information you think is important enough to justify",
    });

    // Run the assistant
    let stream = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      stream: true,
    });

    // Wait for completion and stream the response
    await streamToFile(stream, assistant.id);

    // Clean up - delete the assistant
    await openai.beta.assistants.del(assistant.id);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
