import OpenAI from "openai";
import { readCredentials } from "../helpers/readCredentials";

const { OPENAI_API_KEY } = readCredentials();

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in .codegen/credentials.json");
}

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
