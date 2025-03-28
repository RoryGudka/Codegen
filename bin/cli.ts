#!/usr/bin/env node

import { configure } from "../configure";
import { embeddings } from "../embeddings";
import { gen } from "../gen";
import { view } from "../view";

// Get the operation from the cli command
const target = process.argv[2];
if (target === "configure") {
  configure().then(() => process.exit(0));
} else if (target === "embeddings") {
  embeddings().then(() => process.exit(0));
} else if (target === "gen") {
  const userInput = process.argv[3];
  const n = Number(process.argv[4] || 0);
  gen(userInput, n).then(() => process.exit(0));
} else if (target === "view") {
  view().then(() => process.exit(0));
} else {
  throw new Error(`Invalid command: ${target}`);
}
