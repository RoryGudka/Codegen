require("dotenv").config();
const OpenAI = require("openai");
const {
  askCodebaseQuestionTool,
} = require("../tools/askCodebaseQuestion/askCodebaseQuestionTool");
const {
  askFileQuestionTool,
} = require("../tools/askFileQuestion/askFileQuestionTool");
const {
  editContextFileTool,
} = require("../tools/editContextFile/editContextFileTool");
const { editFileTool } = require("../tools/editFile/editFileTool");
const { getFileStructure } = require("../getFileStructure");
const { createFileTool } = require("../tools/createFile/createFileTool");
const { openai } = require("../clients/openai");
const { getContextFile } = require("../getContextFile");

// Function to create an assistant
async function createAssistant() {
  const fileStructure = getFileStructure();
  const contextFile = getContextFile();
  console.log(fileStructure);

  try {
    const assistant = await openai.beta.assistants.create({
      name: "Meta-Assistant Manager",
      instructions: `You are a high-level assistant specially designed to manage larger codebases. Your primary directive is to modify the codebase as instructed by the user. Before making any modifications, however, you should ensure that you fully understand the step-by-step process of how to solve the problems. To do this, you can use tool calls to ask questions about the codebase or specific files and retrieve context you have stored about the codebase from previous tasks. When doing this, try to focus on broad questions that will help you understand the codebase as a whole, and then narrow in on specific questions that will help you accomplish the task at hand if necessary. Once you do this, you should work incrementally to adjust any and all files necessary to satisfy the user's request. Make sure to reason between each request to ensure that the process is going smoothly, and feel free to reevaluate mid-request if necessary. Once the uesr gives you their request, they will NOT be able to respond again, so you should finish the task instead of asking for clarification. Here is the file structure of the codebase:\n\n${fileStructure}\n\nHere is the context file:\n\n${contextFile}`,
      model: "gpt-4o",
      tools: [
        editFileTool,
        createFileTool,
        askFileQuestionTool,
        editContextFileTool,
      ],
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
