import { ChatCompletionMessageParam } from "openai/resources";
import { createAssistant } from "./assistant/createAssistant";
import { getMostRelevantFiles } from "./helpers/getEmbeddingSimilarity";
import { handlePrimaryAssistantStream } from "./helpers/handlePrimaryAssistantStream";

export async function gen(userInput: string, n: number) {
  try {
    const messages: ChatCompletionMessageParam[] = [
      { role: "user", content: userInput },
    ];
    const files = await getMostRelevantFiles(userInput, n);
    let id = "";

    // Max continue prompts is 5 to prevent infinite looping in worst case
    for (let i = 0; i < 10; i++) {
      const output = await createAssistant(
        files,
        messages[messages.length - 1].role === "assistant"
          ? [
              ...messages,
              {
                role: "user",
                content:
                  "Continue the task. If all changes are made and validated, you must use the endTask tool to exit.",
              },
            ]
          : messages
      );

      if (i === 0) id = output.id;

      const newMessages = await handlePrimaryAssistantStream(output, id);
      messages.push(...newMessages);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
