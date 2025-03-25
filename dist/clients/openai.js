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
exports.DEFAULT_TIMEOUT = exports.DEFAULT_MODEL = exports.openai = void 0;
exports.validateOpenAIConnection = validateOpenAIConnection;
const errorHandling_1 = require("../utils/errorHandling");
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
}
exports.openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
exports.DEFAULT_MODEL = "gpt-4-turbo-preview";
exports.DEFAULT_TIMEOUT = 60000; // 60 seconds
function validateOpenAIConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.openai.models.list();
        }
        catch (error) {
            throw new errorHandling_1.AssistantError("Failed to connect to OpenAI API", "CONNECTION_ERROR", error);
        }
    });
}
