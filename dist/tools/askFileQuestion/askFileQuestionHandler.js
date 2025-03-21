"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askFileQuestionHandler = void 0;
const createFileQuestionAssistant_1 = require("./createFileQuestionAssistant");
const fs_1 = __importDefault(require("fs"));
const streamHelper_1 = require("../../streamHelper");
const openai_1 = require("../../clients/openai");
const path_1 = __importDefault(require("path"));
const askFileQuestionHandler = async ({ filePaths, question, }) => {
    const fullFilePaths = filePaths.map((filePath) => path_1.default.join(process.cwd(), filePath));
    const invalidFilePaths = fullFilePaths.filter((fullFilePath) => !fs_1.default.existsSync(fullFilePath));
    if (invalidFilePaths.length) {
        return `File paths does not exist. Try again with corrected file paths.\nInvalid file paths: ${invalidFilePaths.join(", ")}`;
    }
    const fileContents = fullFilePaths.map((fullFilePath) => [
        fullFilePath,
        fs_1.default.readFileSync(fullFilePath, "utf8"),
    ]);
    const assistant = await (0, createFileQuestionAssistant_1.createFileQuestionAssistant)(fileContents);
    const thread = await openai_1.openai.beta.threads.create();
    await openai_1.openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: question,
    });
    const stream = await openai_1.openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        stream: true,
    });
    return await (0, streamHelper_1.handleAssistantStream)(stream, assistant.id);
};
exports.askFileQuestionHandler = askFileQuestionHandler;
