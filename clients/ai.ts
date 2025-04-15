import OpenAI from "openai";
import { openai } from "./openai";
import { together } from "./togetherai";

let client: OpenAI;
const test = true;

if (test) {
  client = together;
} else {
  client = openai;
}

export { client };
