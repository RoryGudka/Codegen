import {
  applyUpdate,
  simplifiedApplyUpdate,
} from "../tools/editFile/editFileHandler";
import fs from "fs";
import path from "path";

// Test various editing scenarios
const runTests = () => {
  console.log("Running edit file tests...");

  // Create a temporary test file
  const testFilePath = path.join(__dirname, "testFile.txt");
  const originalContent = `
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}
`.trim();

  fs.writeFileSync(testFilePath, originalContent);

  // Test 1: Single edit with placeholders
  console.log("\nTest 1: Single edit with placeholders");
  const update1 = `
{{ ... }}
function subtract(a, b) {
  // Added comment
  return a - b;
}
{{ ... }}
`.trim();

  const result1 = applyUpdate(originalContent, update1);
  console.log("Result:");
  console.log(result1);
  console.log("Expected to contain: '// Added comment'");

  // Test 2: Multiple edits with placeholders
  console.log("\nTest 2: Multiple edits with placeholders");
  const update2 = `
{{ ... }}
function add(a, b) {
  // Add function
  return a + b;
}
{{ ... }}
function multiply(a, b) {
  // Multiply function
  return a * b;
}
{{ ... }}
`.trim();

  const result2 = applyUpdate(originalContent, update2);
  console.log("Result:");
  console.log(result2);
  console.log(
    "Expected to contain: '// Add function' and '// Multiply function'",
  );

  // Test 3: Complete file rewrite
  console.log("\nTest 3: Complete file rewrite");
  const update3 = `
// New file content
function sum(numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

function average(numbers) {
  return sum(numbers) / numbers.length;
}
`.trim();

  const result3 = applyUpdate(originalContent, update3);
  console.log("Result:");
  console.log(result3);
  console.log("Expected complete replacement with new content");

  // Test 4: Edge case - first line edit
  console.log("\nTest 4: Edge case - first line edit");
  const update4 = `
// First line comment
function add(a, b) {
  return a + b;
}
{{ ... }}
`.trim();

  const result4 = applyUpdate(originalContent, update4);
  console.log("Result:");
  console.log(result4);
  console.log("Expected to start with: '// First line comment'");

  // Test 5: Edge case - last line edit
  console.log("\nTest 5: Edge case - last line edit");
  const update5 = `
{{ ... }}
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  // Added comment
  return a / b;
}
`.trim();

  const result5 = applyUpdate(originalContent, update5);
  console.log("Result:");
  console.log(result5);
  console.log("Expected to contain: '// Added comment' before 'return a / b'");

  // Test 6: Edge case - empty file
  console.log("\nTest 6: Edge case - empty file");
  const emptyContent = "";
  const update6 = "// New content for empty file";

  const result6 = applyUpdate(emptyContent, update6);
  console.log("Result:");
  console.log(result6);
  console.log("Expected: '// New content for empty file'");

  // Test 7: Fallback to simplified implementation
  console.log("\nTest 7: Fallback to simplified implementation");
  const update7 = `
{{ ... }}
function calculateArea(radius) {
  return Math.PI * radius * radius;
}
{{ ... }}
`.trim();

  const result7 = simplifiedApplyUpdate(originalContent, update7);
  console.log("Result:");
  console.log(result7);
  console.log("Expected to include the new calculateArea function");

  // Clean up
  fs.unlinkSync(testFilePath);
  console.log("\nAll tests completed");
};

// Run the tests
runTests();
