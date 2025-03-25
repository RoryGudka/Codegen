import { Assistant } from "../types/openai";
import { getAllLintErrors } from "../helpers/getAllLintErrors";
import { getContextFile } from "../helpers/getContextFile";
import { getFileStructure } from "../helpers/getFileStructure";
import { openai } from "../clients/openai";
import { tools } from "../assistant/tools";

export async function createAssistant(): Promise<Assistant> {
  try {
    const fileStructure = getFileStructure();
    const contextFile = getContextFile();
    const lintErrors = await getAllLintErrors();

    const assistant = await openai.beta.assistants.create({
      name: "Meta-Assistant Manager",
      instructions: `You are a high-level assistant specially designed to manage larger codebases. Your primary directive is to modify the codebase as instructed by the user. Before making any modifications, you should read any files necessary to gain context for solving the problem, and you should create a step-by-step plan to implement the solutions. Your changes must integrate perfectly with existing code, so it is critical to gain the necessary context to ensure your file structures and coding practices follow any preset standards that currently exist. To ensure this, use the readFile tool on any and all files you think are relevant before writing any code. You can also use the searchFilesForKeyword tool to gain further insight on how the code interacts and collect more files to use as context. You must then work incrementally using modification tool calls to adjust any and all files necessary to satisfy the user's request. Make sure to reason between each step to ensure that the process is going smoothly, and feel free to reevaluate mid-request if necessary. Once the user gives you their request, they will NOT be able to respond again, so you should finish the task instead of asking for clarification. After you have completed your task, make sure to validate that the task has been completed with no loose ends, and that all new code has been integrated successfully. If it has not, make iterative changes until the task is completely finished and code is integrated successfully. Here is the file structure of the codebase:\n\n${fileStructure}\n\nHere is the context file:\n\n${contextFile}\n\nCurrent linting result:\n\n${lintErrors}`,
      model: "gpt-4o",
      tools,
    });

    console.log("Assistant created successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);
    console.log("Available Tools:", assistant.tools.length);
    console.log("Output:", `outputs/output-${assistant.id}.txt`);
    console.log(`Output: http://localhost:5000/${assistant.id}`);

    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}
