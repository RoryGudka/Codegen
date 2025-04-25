import { generateWithAnthropic } from "./helpers/generateWithAnthropic";

export async function gen(userInput: string, n: number) {
  try {
    await generateWithAnthropic(userInput, n);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
