require("dotenv").config();
const OpenAI = require("openai");
const {
  askCodebaseQuestionTool,
} = require("../askCodebaseQuestion/askCodebaseQuestionTool");
const {
  askFileQuestionTool,
} = require("../askFileQuestion/askFileQuestionTool");
const {
  editContextFileTool,
} = require("../editContextFile/editContextFileTool");
const { editFileTool } = require("../editFile/editFileTool");
const { getFileStructure } = require("../getFileStructure");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to create an assistant
async function createAssistant() {
  const fileStructure = getFileStructure();
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Meta-Assistant Manager",
      instructions: `You are a high-level assistant specially designed to manage larger codebases. Your primary directive is to modify the codebase as instructed by the user. Before making any modifications, however, you should ensure that you fully understand the step-by-step process of how to solve the problems. To do this, you can use tool calls to ask questions about the codebase or specific files and retrieve context you have stored about the codebase from previous tasks. Once you do this, you should work incrementally to adjust any and all files necessary to satisfy the user's request. Make sure to reason between each request to ensure that the process is going smoothly, and feel free to reevaluate mid request if necessary. Once the uesr gives you their request, they will NOT be able to respond again, so you should finish the task instead of asking for clarification. Here is the file structure of the codebase:\n\n${fileStructure}`,
      model: "gpt-4o",
      tools: [editFileTool],
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
