import { generateWithAnthropic } from "./helpers/generateWithAnthropic";
import { startServer } from "./helpers/startServer";

// Test cases
/*
  // const file = `Code 0\nCode 1`;
  // const update = `{{ ... }}\nCode 1\nCode 2\nCode 3`;
  // const file = `Code 3\nCode 4`;
  // const update = `Code 1\nCode 2\nCode 3\n{{ ... }}`;
  // const file = `Code 3\nCode 4\nCode 10\nCode 11\nCode 13\nCode 14\nCode 20\nCode 21\nCode 23\nCode 24\nCode 30\nCode 31`;
  // const update = `Code 1\nCode 2\nCode 3\n{{ ... }}\nCode 11\nCode 12\nCode 13\n{{ ... }}\nCode 21\nCode 22\nCode 23\n{{ ... }}\nCode 31\nCode 32\nCode 33`;
  // const file = `Code 0\nCode 1\nCode 3\nCode 4\nCode 10\nCode 11\nCode 13\nCode 14`;
  // const update = `{{ ... }}\nCode 1\nCode 2\nCode 3\n{{ ... }}\nCode 11\nCode 12\nCode 13\n{{ ... }}`;
  // const file = `Code 1\nCode 2\nCode 3\n`;
  // const update = `{{ ... }}`;
  // const file = `Code 0\n`;
  // const update = `Code 1\nCode 2\nCode 3\n`;
  // const file = `Code 1\nCode 2\nCode 3\n Code 2\nCode 4`;
  // const update = `Code 0\nCode 2\n{{ ... }}`;
  const file = `Code 1\nCode 2\nCode 3\n Code 2\nCode 4`;
  const update = `{{ ... }}\nCode 2\nCode 6`;
  console.log(applyUpdate(file, update));
*/

export async function gen(userInput: string, n: number) {
  try {
    await startServer();
    await generateWithAnthropic(userInput, n);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
