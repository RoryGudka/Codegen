import { ContextFileContent } from "./editFileHandler";
import OpenAI from "openai";
import { openai } from "../../clients/openai";

async function createEditFileAssistant(
  editFilePath: string,
  editFileContent: string,
  contextFileContents: ContextFileContent[]
): Promise<OpenAI.Beta.Assistants.Assistant> {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Edit File Assistant",
      instructions: `You are a coding assistant specially designed to edit files with given instructions and context files. Make sure to follow the instructions carefully, and do NOT add placeholder text like \`\/\/Old code\/\/\`. Respond with the edited code ONLY, NOT in a code block, and with NO additional text.\n\n--------------------\nFILE TO EDIT: ${editFilePath}\n--------------------\n\n${editFileContent}\n\n${contextFileContents
        .map(
          ([path, content]) =>
            `--------------------\nCONTEXT FILE:${path}\n--------------------\n\n${content}`
        )
        .join("\n\n")}`,
      model: "gpt-4",
    });

    console.log("Code Edit Assistant created successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);

    return assistant;
  } catch (error) {
    console.error("Error creating code edit assistant:", error);
    throw error;
  }
}

export { createEditFileAssistant };
