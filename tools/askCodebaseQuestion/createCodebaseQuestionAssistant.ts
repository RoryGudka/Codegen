import { openai } from "../../clients/openai";

async function createCodebaseQuestionAssistant() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Codebase Question Assistant",
      instructions:
        "This assistant is specialized in addressing broader questions about the codebase. It provides context about multiple files and their interactions, helping to understand overall architecture, design patterns, and codebase-level inquiries.",
      model: "gpt-4o",
    });

    console.log("Codebase QA Assistant created successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);
    return assistant;
  } catch (error) {
    console.error("Error creating codebase QA assistant:", error);
    throw error;
  }
}

export { createCodebaseQuestionAssistant };
