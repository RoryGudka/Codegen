import { Assistant } from "../types/openai";
import { openai } from "../clients/openai";

export async function createAssistant(): Promise<Assistant> {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Code Assistant",
      instructions: "You are a helpful coding assistant.",
      model: "gpt-4-turbo-preview",
    });
    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}
