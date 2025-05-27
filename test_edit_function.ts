// Test file for the new edit function
import { applyUpdate } from "./tools/editFile/editFileHandler";

const testFileContent = `import fs from "fs";
import path from "path";

function oldFunction() {
  console.log("old implementation");
  return false;
}

const someVariable = "old value";

export { oldFunction };`;

// Test 1: Line-based edit
const lineBasedUpdate = `// Lines 4-6:
function newFunction() {
  console.log("new implementation");
  return true;
}

// Lines 8:
const someVariable = "new value";`;

// Test 2: Placeholder-based edit
const placeholderUpdate = `{{ ... }}
function newFunction() {
  console.log("new implementation");
  return true;
}

{{ ... }}
const someVariable = "new value";
{{ ... }}`;

// Test 3: Context-based edit
const contextUpdate = `import fs from "fs";
import path from "path";

function newFunction() {
  console.log("new implementation");
  return true;
}

const someVariable = "new value";

export { newFunction };`;

async function runTests() {
  console.log("Testing new edit function...\n");

  try {
    console.log("Test 1: Line-based edit");
    const result1 = applyUpdate(testFileContent, lineBasedUpdate);
    console.log("✅ Line-based edit successful");
    console.log("Result preview:", result1.substring(0, 100) + "...\n");
  } catch (error) {
    console.log("❌ Line-based edit failed:", error.message, "\n");
  }

  try {
    console.log("Test 2: Placeholder-based edit");
    const result2 = applyUpdate(testFileContent, placeholderUpdate);
    console.log("✅ Placeholder-based edit successful");
    console.log("Result preview:", result2.substring(0, 100) + "...\n");
  } catch (error) {
    console.log("❌ Placeholder-based edit failed:", error.message, "\n");
  }

  try {
    console.log("Test 3: Context-based edit");
    const result3 = applyUpdate(testFileContent, contextUpdate);
    console.log("✅ Context-based edit successful");
    console.log("Result preview:", result3.substring(0, 100) + "...\n");
  } catch (error) {
    console.log("❌ Context-based edit failed:", error.message, "\n");
  }
}

runTests();
