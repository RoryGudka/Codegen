"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editFileHandler = void 0;
const streamHelper_1 = require("../../streamHelper");
const createEditFileAssistant_1 = require("./createEditFileAssistant");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const editFileHandler = async ({ contextFilePaths = [], editFilePath, instructions, }) => {
    const fullEditFilePath = path_1.default.join(process.cwd(), editFilePath);
    if (!fs_1.default.existsSync(fullEditFilePath)) {
        return "File path does not exist. Try again with createFile or corrected file path.";
    }
    const fullContextFilePaths = contextFilePaths.map((p) => path_1.default.join(process.cwd(), p));
    const contextFileContents = fullContextFilePaths.map((path) => [path, fs_1.default.readFileSync(path, "utf8")]);
    const editFileContent = fs_1.default.readFileSync(fullEditFilePath, "utf8");
    try {
        const assistant = await (0, createEditFileAssistant_1.createEditFileAssistant)(fullEditFilePath, editFileContent, contextFileContents);
        const thread = await streamHelper_1.openai.beta.threads.create();
        await streamHelper_1.openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: instructions,
        });
        const stream = await streamHelper_1.openai.beta.threads.runs.create(thread.id, {
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
exports.editFileHandler = editFileHandler;
