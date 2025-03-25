"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { openai } = require("../../clients/openai");
function createFileQuestionAssistant(fileContents) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const assistant = yield openai.beta.assistants.create({
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
    });
}
module.exports = {
    createFileQuestionAssistant,
};
