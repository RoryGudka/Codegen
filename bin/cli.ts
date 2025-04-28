#!/usr/bin/env node

import { help, isHelpCommand } from "../help";

import { configure } from "../configure";
import { embeddings } from "../embeddings";
import { gen } from "../gen";
import { getUserInput } from "../helpers/getUserInput";

// Get the operation from the cli command
const codegen = async () => {
  const target = process.argv[2];
  if (target === "configure") {
    await configure();
    process.exit(0);
  } else if (target === "embeddings") {
    await embeddings();
    process.exit(0);
  } else if (target === "gen") {
    const [, , , givenInput, givenNInput] = process.argv;

    if (givenInput) {
      const givenN = givenNInput ? Number(givenNInput) : 0;
      if (isNaN(givenN)) throw new Error("Invalid number of files");
      await gen(givenInput, givenN);
    } else {
      const userInput = await getUserInput("Prompt: ", true);
      const nInput = await getUserInput("Relevant files (optional): ");
      const n = nInput ? Number(nInput) : 0;
      if (isNaN(n)) throw new Error("Invalid number of files");
      await gen(userInput, n);
    }
  } else if (isHelpCommand(target)) {
    help();
    process.exit(0);
  } else {
    throw new Error(`Invalid command: ${target}`);
  }
};

codegen();
