"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFilePaths = exports.askCodebaseQuestionHandler = void 0;
const streamHelper_1 = require("../../streamHelper");
const createCodebaseQuestionAssistant_1 = require("./createCodebaseQuestionAssistant");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const verifyFilePaths = (filePaths) => {
    return filePaths.every((filePath) => fs_1.default.existsSync(filePath));
};
exports.verifyFilePaths = verifyFilePaths;
const askCodebaseQuestionHandler = async ({ question, }) => {
    const assistant = await (0, createCodebaseQuestionAssistant_1.createCodebaseQuestionAssistant)();
    const thread = await streamHelper_1.openai.beta.threads.create();
    await streamHelper_1.openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: question,
    });
    const stream = await streamHelper_1.openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        stream: true,
    });
    const content = await (0, streamHelper_1.handleAssistantStream)(stream, assistant.id);
    const outputPath = path_1.default.join(__dirname, "output.txt");
    fs_1.default.writeFileSync(outputPath, content);
    return content;
};
exports.askCodebaseQuestionHandler = askCodebaseQuestionHandler;
