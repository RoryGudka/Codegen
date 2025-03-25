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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCodebaseQuestionAssistant = createCodebaseQuestionAssistant;
const openai_1 = require("../../clients/openai");
function createCodebaseQuestionAssistant() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const assistant = yield openai_1.openai.beta.assistants.create({
                name: "Codebase Question Assistant",
                instructions: "This assistant is specialized in addressing broader questions about the codebase. It provides context about multiple files and their interactions, helping to understand overall architecture, design patterns, and codebase-level inquiries.",
                model: "gpt-4o",
            });
            console.log("Codebase QA Assistant created successfully!");
            console.log("Assistant ID:", assistant.id);
            console.log("Assistant Name:", assistant.name);
            return assistant;
        }
        catch (error) {
            console.error("Error creating codebase QA assistant:", error);
            throw error;
        }
    });
}
