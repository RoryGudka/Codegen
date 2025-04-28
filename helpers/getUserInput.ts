import * as readline from "readline";

export function getUserInput(
  prompt: string,
  multiline: boolean = false
): Promise<string> {
  if (!multiline) {
    // Standard single-line input
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  } else {
    // Multiline input that accepts \n characters
    console.info(prompt);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    let userInput = "";
    let lastLineEmpty = false;

    return new Promise((resolve) => {
      rl.on("line", (line) => {
        if (line.trim() === "" && lastLineEmpty) {
          rl.close();
          resolve(userInput.trimEnd());
        } else {
          if (line.trim() === "") {
            lastLineEmpty = true;
          } else {
            lastLineEmpty = false;
          }

          if (userInput) {
            userInput += "\n" + line;
          } else {
            userInput = line;
          }
        }
      });
    });
  }
}
