import { createSystemPrompt } from "./createSystemPrompt";
import { nanoid } from "nanoid";
import { openai } from "../clients/openai";
import { tools } from "./tools";

export async function createOpenAIStream(files: [string, string][]) {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Meta-Assistant Manager",
      instructions: await createSystemPrompt(files),
      model: "gpt-4o",
      tools,
    });

    const id = nanoid();

    console.info("Assistant created successfully!");
    console.info("Assistant ID:", id);
    console.info("Available Tools:", tools.length);
    console.info(`Most relevant files:\n${files.map(([p]) => p).join("\n")}`);
    console.info("Output:", `.codegen/outputs/output-${id}.txt`);
    console.info(`Output: http://localhost:5000/${id}`);

    return { assistant, id };
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}
