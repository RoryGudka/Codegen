#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

// Capture arguments passed from the CLI command
const inputArgs = process.argv.slice(2);

// Construct the path to the dist/init.js script
const initScriptPath = path.join(__dirname, "..", "dist", "init.js");

// Run the init.js script with additional input arguments
const child = spawn("node", [initScriptPath, ...inputArgs], {
  stdio: "inherit",
});

child.on("close", (code) => {
  process.exit(code);
});
