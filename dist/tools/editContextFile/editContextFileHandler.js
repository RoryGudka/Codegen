"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editContextFileHandler = void 0;
const createEditContextFileAssistant_1 = require("./createEditContextFileAssistant");
const fs_1 = __importDefault(require("fs"));
const streamHelper_1 = require("../../streamHelper");
const openai_1 = require("../../clients/openai");
const path_1 = __importDefault(require("path"));
const editContextFileHandler = async ({ update, }) => {
    const fullEditFilePath = path_1.default.join(process.cwd(), ".codegen/context.txt");
    // Create directory if it doesn't exist
    const dirPath = path_1.default.dirname(fullEditFilePath);
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
    // Create file with empty content if it doesn't exist
    if (!fs_1.default.existsSync(fullEditFilePath)) {
        fs_1.default.writeFileSync(fullEditFilePath, "");
    }
    const contextFileContent = fs_1.default.readFileSync(fullEditFilePath, "utf8");
    try {
        const assistant = await (0, createEditContextFileAssistant_1.createEditContextFileAssistant)(contextFileContent);
        const thread = await openai_1.openai.beta.threads.create();
        await openai_1.openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: update,
        });
        const stream = await openai_1.openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id,
            stream: true,
        });
        const content = await (0, streamHelper_1.handleAssistantStream)(stream, assistant.id);
        fs_1.default.writeFileSync(fullEditFilePath, content);
        return "File edited successfully";
    }
    catch (error) {
        console.error("Error creating assistant:", error);
        throw error;
    }
};
exports.editContextFileHandler = editContextFileHandler;
