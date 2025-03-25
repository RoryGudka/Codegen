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
const createAssistant_1 = require("./assistant/createAssistant");
const handlePrimaryAssistantStream_1 = require("./helpers/handlePrimaryAssistantStream");
const openai_1 = require("./clients/openai");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a new assistant
            const assistant = yield (0, createAssistant_1.createAssistant)();
            if (!assistant) {
                throw new Error("Failed to create assistant");
            }
            // Create a thread
            const thread = yield openai_1.openai.beta.threads.create();
            // Add a message to the thread
            yield openai_1.openai.beta.threads.messages.create(thread.id, {
                role: "user",
                content: "Fix the build step to finish converting this repository to typescript.",
            });
            // Max continue prompts is 5 to prevent infinite looping in worst case
            for (let i = 0; i < 5; i++) {
                // Run the assistant
                const run = yield openai_1.openai.beta.threads.runs.create(thread.id, {
                    assistant_id: assistant.id,
                    stream: false,
                });
                // Wait for completion and stream the response
                yield (0, handlePrimaryAssistantStream_1.handlePrimaryAssistantStream)(run, assistant.id, {
                    onMessage: (message) => console.log(`Assistant: ${message}`),
                    onError: (error) => console.error(`Error: ${error.message}`),
                    onComplete: () => console.log("Stream completed"),
                });
                // Prompt the assistant to continue or end
                yield openai_1.openai.beta.threads.messages.create(thread.id, {
                    role: "user",
                    content: "Continue the task. If all changes are made and validated, you must use the endTask tool to exit.",
                });
            }
        }
        catch (error) {
            console.error("Error:", error);
            process.exit(1);
        }
    });
}
main().catch(console.error);
