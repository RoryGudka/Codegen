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
exports.editContextFileHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const editContextFileHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ content }) {
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
    fs_1.default.writeFileSync(fullEditFilePath, content);
    return "Context file edited successfully";
});
exports.editContextFileHandler = editContextFileHandler;
