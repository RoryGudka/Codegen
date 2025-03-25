const { getFileStructure } = require("../getFileStructure");
const { openai } = require("../clients/openai");
const { getContextFile } = require("../getContextFile");
const { tools } = require("./tools");

// Function to create an assistant
async function createAssistant() {
  const fileStructure = getFileStructure();
  const contextFile = getContextFile();

  try {
    const assistant = await openai.beta.assistants.create({
      name: "Meta-Assistant Manager",
      instructions: `You are a high-level assistant specially designed to manage larger codebases. Your primary directive is to modify the codebase as instructed by the user. Before making any modifications, you should read any files necessary to gain context for solving the problem, and you should create a step-by-step plan to implement the solutions. Your changes must integrate perfectly with existing code, so it is critical to gain the necessary context to ensure your file structures and coding practices follow any preset standards that currently exist. You must then work incrementally using modification tool calls to adjust any and all files necessary to satisfy the user's request. Make sure to reason between each step to ensure that the process is going smoothly, and feel free to reevaluate mid-request if necessary. Once the user gives you their request, they will NOT be able to respond again, so you should finish the task instead of asking for clarification. After you have completed your task, make sure to validate that the task has been completed with no loose ends, and that all new code has been integrated successfully. If it has not, make iterative changes until the task is completely finished and code is integrated successfully. Here is the file structure of the codebase:\n\n${fileStructure}\n\nHere is the context file:\n\n${contextFile}`,
      model: "gpt-4o",
      tools,
    });

    console.log("Assistant created successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);
    console.log("Available Tools:", assistant.tools.length);
    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
  }
}

module.exports = {
  createAssistant,
};
