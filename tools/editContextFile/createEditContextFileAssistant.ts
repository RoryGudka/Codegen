import type { OpenAI } from "openai";
import { openai } from "../../clients/openai";

export async function createEditContextFileAssistant(
  contextFileContent: string
): Promise<OpenAI.Beta.Assistant> {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Edit Context File Assistant",
      instructions: `You are a coding assistant specially designed to maintain a context file for a codebase. Update the context file based on the user's request. Respond with the edited context file ONLY, NOT in a code block, and with NO additional text.\n\n--------------------\nCURRENT CONTEXT FILE\n--------------------\n\n${contextFileContent}`,
      model: "gpt-4o",
    });

    console.log("Context Editor Assistant created successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);

    return assistant;
  } catch (error) {
    console.error("Error creating context editor assistant:", error);
    throw error;
  }
}
