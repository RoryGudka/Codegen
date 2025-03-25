import { AssistantError } from "../utils/errorHandling";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const DEFAULT_MODEL = "gpt-4-turbo-preview";
export const DEFAULT_TIMEOUT = 60000; // 60 seconds

export async function validateOpenAIConnection(): Promise<void> {
  try {
    await openai.models.list();
  } catch (error) {
    throw new AssistantError(
      "Failed to connect to OpenAI API",
      "CONNECTION_ERROR",
      error
    );
  }
}
