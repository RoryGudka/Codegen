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
exports.renameFileHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const runEslint_1 = require("../../helpers/runEslint");
const renameFileHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ filePath, newFileName, }) {
    const fullFilePath = path_1.default.join(process.cwd(), filePath);
    const directoryPath = path_1.default.dirname(fullFilePath);
    const newFilePath = path_1.default.join(directoryPath, newFileName);
    if (!fs_1.default.existsSync(fullFilePath)) {
        return "File path does not exist. Cannot rename file.";
    }
    try {
        if (path_1.default.dirname(newFileName) !== ".") {
            throw new Error("Directory change detected. Operation not allowed.");
        }
        fs_1.default.renameSync(fullFilePath, newFilePath);
        // Run ESLint on renamed file if it's a JavaScript/TypeScript file
        if (newFilePath.match(/\.(js|ts)x?$/)) {
            const lintingResult = yield (0, runEslint_1.runEslintOnFile)(newFilePath);
            return `File renamed successfully.\nLinting result:\n${lintingResult}`;
        }
        return "File renamed successfully.";
    }
    catch (error) {
        return `Failed to rename file: ${error.message}`;
    }
});
exports.renameFileHandler = renameFileHandler;
