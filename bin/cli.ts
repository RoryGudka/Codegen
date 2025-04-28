#!/usr/bin/env node

import { configure } from "../configure";
import { embeddings } from "../embeddings";
import { gen } from "../gen";
import { getUserInput } from "../helpers/getUserInput";
import { view } from "../view";

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
    const userInput = await getUserInput("Prompt: ");
    const nInput = await getUserInput("Relevant files (optional): ");
    const n = nInput ? Number(nInput) : 0;
    if (isNaN(n)) throw new Error("Number of files must be a valid number");

    await gen(userInput, n);
    process.exit(0);
  } else if (target === "view") {
    await view();
    process.exit(0);
  } else {
    throw new Error(`Invalid command: ${target}`);
  }
};

codegen();
