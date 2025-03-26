#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

// Get the operation from the cli command
const target = process.argv[2];
if (target !== "gen" && target !== "view" && target !== "embeddings") {
  process.exit(1);
}

// Capture arguments passed from the CLI command
const inputArgs = process.argv.slice(3);

// Construct the path to the dist/gen.js script
const initScriptPath = path.join(__dirname, "..", "dist", `${target}.js`);

// Run the init.js script with additional input arguments
const child = spawn("node", [initScriptPath, ...inputArgs], {
  stdio: "inherit",
});

child.on("close", (code) => {
  process.exit(code);
});
