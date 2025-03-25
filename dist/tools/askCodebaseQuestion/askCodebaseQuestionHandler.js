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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askCodebaseQuestionHandler = void 0;
const createCodebaseQuestionAssistant_1 = require("./createCodebaseQuestionAssistant");
const fs_1 = __importDefault(require("fs"));
const handleAssistantStream_1 = require("../../helpers/handleAssistantStream");
const openai_1 = require("../../clients/openai");
const path_1 = __importDefault(require("path"));
const verifyFilePaths = (filePaths) => {
    return filePaths.every((filePath) => fs_1.default.existsSync(filePath));
};
const askCodebaseQuestionHandler = (question, filePaths) => __awaiter(void 0, void 0, void 0, function* () {
    if (!verifyFilePaths(filePaths)) {
        throw new Error("One or more file paths are invalid.");
    }
    try {
        const assistant = yield (0, createCodebaseQuestionAssistant_1.createCodebaseQuestionAssistant)();
        const thread = yield openai_1.openai.beta.threads.create();
        const fileContents = filePaths
            .map((filePath) => {
            const content = fs_1.default.readFileSync(filePath, "utf8");
            return `${filePath}:\n${content}\n`;
        })
            .join("\n");
        yield openai_1.openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: `${question}\n\nFiles Content:\n${fileContents}`,
        });
        const stream = yield openai_1.openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id,
            stream: true,
        });
        const content = yield (0, handleAssistantStream_1.handleAssistantStream)(stream, assistant.id);
        const outputPath = path_1.default.join(__dirname, "output.txt");
        fs_1.default.writeFileSync(outputPath, content);
        return assistant;
    }
    catch (error) {
        console.error("Error creating assistant:", error);
        throw error;
    }
});
exports.askCodebaseQuestionHandler = askCodebaseQuestionHandler;
