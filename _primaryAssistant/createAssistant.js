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
const {
  searchFilesForKeywordTool,
} = require("../tools/searchFilesForKeyword/searchFilesForKeywordTool");
const { readFileTool } = require("../tools/readFile/readFileTool");
const { searchTheWebTool } = require("../tools/searchTheWeb/searchTheWebTool");
const { moveFileTool } = require("../tools/moveFile/moveFileTool");
const { deleteFileTool } = require("../tools/deleteFile/deleteFileTool");
const { renameFileTool } = require("../tools/renameFile/renameFileTool");

// Function to create an assistant
async function createAssistant() {
  const fileStructure = getFileStructure();
  const contextFile = getContextFile();

  try {
    const assistant = await openai.beta.assistants.create({
      name: "Meta-Assistant Manager",
      instructions: `You are a high-level assistant specially designed to manage larger codebases. Your primary directive is to modify the codebase as instructed by the user. Before making any modifications, you should read any files necessary to gain context for solving the problem, and you should create a step-by-step plan to implement the solutions. You must then work incrementally using modification tool calls to adjust any and all files necessary to satisfy the user's request. Make sure to reason between each step to ensure that the process is going smoothly, and feel free to reevaluate mid-request if necessary. Once the user gives you their request, they will NOT be able to respond again, so you should finish the task instead of asking for clarification. If there is similar file structure patterns or instances of code you can emulate, find and utilize them where possible. Here is the file structure of the codebase:\n\n${fileStructure}\n\nHere is the context file:\n\n${contextFile}`,
      model: "gpt-4o",
      tools: [
        readFileTool,
        editFileTool,
        createFileTool,
        deleteFileTool,
        moveFileTool,
        renameFileTool,
        editContextFileTool,
        searchFilesForKeywordTool,
        searchTheWebTool,
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
