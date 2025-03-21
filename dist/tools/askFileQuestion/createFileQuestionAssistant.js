"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileQuestionAssistant = createFileQuestionAssistant;
const openai_1 = require("../../clients/openai");
async function createFileQuestionAssistant(fileContents) {
    try {
        const assistant = await openai_1.openai.beta.assistants.create({
            name: "Create File Question Assistant",
            instructions: `You are a coding assistant specially designed to answer questions about files after thorough investigation. Read the files carefully and anwer the user's question with a concise and accurate response.\n\n${fileContents
                .map(([filePath, content]) => `--------------------\nCONTEXT FILE: ${filePath}\n--------------------\n${content}`)
                .join("\n\n")}`,
            model: "gpt-4o",
        });
        console.log("File QA Assistant created successfully!");
        console.log("Assistant ID:", assistant.id);
        console.log("Assistant Name:", assistant.name);
        return assistant;
    }
    catch (error) {
        console.error("Error creating file QA assistant:", error);
        throw error;
    }
}
