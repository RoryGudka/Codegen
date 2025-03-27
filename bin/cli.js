#!/usr/bin/env node
const { view } = require("../dist/view");
const { gen } = require("../dist/gen");
const { configure } = require("../dist/configure");
const { embeddings } = require("../dist/embeddings");

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
