import OpenAI from "openai";
import { readCredentials } from "../helpers/readCredentials";

const { TOGETHER_API_KEY } = readCredentials();

export const together = new OpenAI({
  apiKey: TOGETHER_API_KEY,
  baseURL: "https://api.together.xyz/v1",
});
