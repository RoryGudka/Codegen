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
exports.handlePrimaryAssistantStream = handlePrimaryAssistantStream;
const openai_1 = require("../clients/openai");
function handlePrimaryAssistantStream(run, assistantId, callbacks) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const messages = yield openai_1.openai.beta.threads.messages.list(run.thread_id);
            for (const message of messages.data) {
                if (message.role === "assistant" && message.content) {
                    const content = message.content[0];
                    if ("text" in content) {
                        (_a = callbacks.onMessage) === null || _a === void 0 ? void 0 : _a.call(callbacks, content.text.value);
                    }
                }
            }
            (_b = callbacks.onComplete) === null || _b === void 0 ? void 0 : _b.call(callbacks);
        }
        catch (error) {
            if (error instanceof Error) {
                (_c = callbacks.onError) === null || _c === void 0 ? void 0 : _c.call(callbacks, error);
            }
            else {
                (_d = callbacks.onError) === null || _d === void 0 ? void 0 : _d.call(callbacks, new Error("Unknown error occurred"));
            }
        }
    });
}
