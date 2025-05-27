import { MessageParam, Tool, ToolUnion } from "@anthropic-ai/sdk/resources";

import { anthropic } from "../clients/anthropic";
import { createSystemPrompt } from "./createSystemPrompt";
import { nanoid } from "nanoid";
import { produce } from "immer";
import { retryWithRateLimit } from "../helpers/retryWithRateLimit";
import { tools } from "./tools";

export async function createAnthropicStream(
  files: [string, string][],
  messages: MessageParam[],
  disableLogs?: boolean
) {
  const formatted = tools.map((tool) => ({
    name: tool.function.name,
    description: tool.function.description,
    input_schema: tool.function.parameters as Tool.InputSchema,
  })) as ToolUnion[];

  try {
    // Use the retry function to handle rate limits
    const stream = await retryWithRateLimit(async () => {
      return await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 64000,
        stream: true,
        tools: produce(formatted, (draft) => {
          draft[draft.length - 1].cache_control = { type: "ephemeral" };
        }),
        system: [
          {
            type: "text",
            text: await createSystemPrompt(files),
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: produce(messages, (draft) => {
          const content = draft[draft.length - 1].content;
          if (typeof content !== "string") {
            const block = content[content.length - 1];
            if (
              block.type !== "thinking" &&
              block.type !== "redacted_thinking"
            ) {
              block.cache_control = { type: "ephemeral" };
            }
          }
        }),
      });
    });

    const id = nanoid();

    if (!disableLogs) {
      console.info("Assistant created successfully!");
      console.info("Assistant ID:", id);
      console.info("Available Tools:", tools.length);
      console.info(`Most relevant files:\n${files.map(([p]) => p).join("\n")}`);
      console.info("Output:", `.codegen/outputs/output-${id}.txt`);
      console.info(`Output: http://localhost:5000/${id}`);
    }

    return { stream, id };
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}
