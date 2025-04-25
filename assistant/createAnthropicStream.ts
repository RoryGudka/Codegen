import { MessageParam, Tool } from "@anthropic-ai/sdk/resources";

import { anthropic } from "../clients/anthropic";
import { createSystemPrompt } from "./createSystemPrompt";
import { nanoid } from "nanoid";
import { tools } from "./tools";

export async function createAnthropicStream(
  files: [string, string][],
  messages: MessageParam[]
) {
  try {
    const stream = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 64000,
      stream: true,
      tools: tools.map((tool) => ({
        name: tool.function.name,
        description: tool.function.description,
        input_schema: tool.function.parameters as Tool.InputSchema,
      })),
      system: await createSystemPrompt(files),
      messages,
    });

    const id = nanoid();

    console.info("Assistant created successfully!");
    console.info("Assistant ID:", id);
    console.info("Available Tools:", tools.length);
    console.info(`Most relevant files:\n${files.map(([p]) => p).join("\n")}`);
    console.info("Output:", `.codegen/outputs/output-${id}.txt`);
    console.info(`Output: http://localhost:5000/${id}`);

    return { stream, id };
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}
