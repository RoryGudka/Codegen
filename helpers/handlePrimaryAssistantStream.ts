import { AssistantRun } from "../types/openai";
import { openai } from "../clients/openai";

interface StreamCallbacks {
  onMessage?: (message: string) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export async function handlePrimaryAssistantStream(
  run: AssistantRun,
  assistantId: string,
  callbacks: StreamCallbacks
): Promise<void> {
  try {
    const messages = await openai.beta.threads.messages.list(run.thread_id);

    for (const message of messages.data) {
      if (message.role === "assistant" && message.content) {
        const content = message.content[0];
        if ("text" in content) {
          callbacks.onMessage?.(content.text.value);
        }
      }
    }

    callbacks.onComplete?.();
  } catch (error) {
    if (error instanceof Error) {
      callbacks.onError?.(error);
    } else {
      callbacks.onError?.(new Error("Unknown error occurred"));
    }
  }
}
