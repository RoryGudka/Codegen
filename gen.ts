import { generateWithAnthropic } from "./helpers/generateWithAnthropic";
import { startServer } from "./helpers/startServer";

export async function gen(userInput: string, n: number) {
  try {
    await startServer();
    await generateWithAnthropic(userInput, n);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
