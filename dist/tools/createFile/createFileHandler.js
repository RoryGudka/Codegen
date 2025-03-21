"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const streamHelper_1 = require("../../streamHelper");
const openai_1 = require("../../clients/openai");
const path_1 = __importDefault(require("path"));
const createFileHandler = async ({ contextFilePaths = [], newFilePath, instructions, }) => {
    const fullNewFilePath = path_1.default.join(process.cwd(), newFilePath);
    const fullContextFilePaths = contextFilePaths.map((p) => path_1.default.join(process.cwd(), p));
    // Check if file already exists
    if (fs_1.default.existsSync(fullNewFilePath)) {
        return "File already exists. Try again with editFile or corrected file path.";
    }
    const contextFileContents = fullContextFilePaths.map((path) => [path, fs_1.default.readFileSync(path, "utf8")]);
    try {
        const assistant = await openai_1.openai.beta.assistants.create({
            name: "Create File Assistant",
            instructions: `You are a coding assistant specially designed to create new files with given instructions and context files. Make sure to follow the instructions carefully, and do NOT add placeholder text like \`\/\/Insert code here\/\/\`. Respond with the new code only, not in a code block, and with no additional text.\n\n--------------------\nNEW FILE TO CREATE: ${newFilePath}\n--------------------\n\n${contextFileContents
                .map(([path, content]) => `--------------------\nCONTEXT FILE:${path}\n--------------------\n\n${content}`)
                .join("\n\n")}`,
            model: "gpt-4o",
            tools: [],
        });
        console.log("Assistant created successfully!");
        console.log("Assistant ID:", assistant.id);
        console.log("Assistant Name:", assistant.name);
        console.log("Available Tools:", assistant.tools.length);
        const thread = await openai_1.openai.beta.threads.create();
        await openai_1.openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: instructions,
        });
        const stream = await openai_1.openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id,
            stream: true,
        });
        const content = await (0, streamHelper_1.handleAssistantStream)(stream, assistant.id);
        // Create directory if it doesn't exist
        const dirPath = path_1.default.dirname(fullNewFilePath);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
        fs_1.default.writeFileSync(fullNewFilePath, content);
        return "File created successfully";
    }
    catch (error) {
        console.error("Error creating file:", error);
        throw error;
    }
};
exports.createFileHandler = createFileHandler;
