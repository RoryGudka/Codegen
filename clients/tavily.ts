import { readCredentials } from "../helpers/readCredentials";
import { tavily } from "@tavily/core";

const { TAVILY_API_KEY } = readCredentials();

if (!TAVILY_API_KEY) {
  throw new Error("TAVILY_API_KEY is not set in .codegen/credentials.json");
}

const tvly = tavily({ apiKey: TAVILY_API_KEY });

export { tvly };
