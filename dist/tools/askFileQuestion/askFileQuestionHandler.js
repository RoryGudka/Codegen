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
const { createFileQuestionAssistant, } = require("./createFileQuestionAssistant");
const { openai } = require("../../clients/openai");
const fs = require("fs");
const path = require("path");
const { handleAssistantStream } = require("../../streamHelper");
const askFileQuestionHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ filePaths, question }) {
    const fullFilePaths = filePaths.map((filePath) => path.join(process.cwd(), filePath));
    const invalidFilePaths = fullFilePaths.filter((fullFilePath) => !fs.existsSync(fullFilePath));
    if (invalidFilePaths.length) {
        return `File paths does not exist. Try again with corrected file paths.\nInvalid file paths: ${invalidFilePaths.join(", ")}`;
    }
    const fileContents = fullFilePaths.map((fullFilePath) => [
        fullFilePath,
        fs.readFileSync(fullFilePath, "utf8"),
    ]);
    const assistant = yield createFileQuestionAssistant(fileContents);
    const thread = yield openai.beta.threads.create();
    yield openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: question,
    });
    const stream = yield openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        stream: true,
    });
    return yield handleAssistantStream(stream, assistant.id);
});
module.exports = {
    askFileQuestionHandler,
};
