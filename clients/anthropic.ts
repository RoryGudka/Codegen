import Anthropic from "@anthropic-ai/sdk";
import { readCredentials } from "../helpers/readCredentials";

const { ANTHROPIC_API_KEY } = readCredentials();

if (!ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set in .codegen/credentials.json");
}

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

export { anthropic };
