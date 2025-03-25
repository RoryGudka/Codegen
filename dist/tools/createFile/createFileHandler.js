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
exports.createFileHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const runEslint_1 = require("../../helpers/runEslint");
const createFileHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ newFilePath, content, }) {
    const fullPath = path_1.default.join(process.cwd(), newFilePath);
    if (fs_1.default.existsSync(fullPath)) {
        return "File already exists. Cannot create duplicate file.";
    }
    try {
        const dir = path_1.default.dirname(fullPath);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        fs_1.default.writeFileSync(fullPath, content, "utf8");
        // Run ESLint on the newly created file
        const lintingResult = yield (0, runEslint_1.runEslintOnFile)(fullPath);
        return `File created successfully.\nLinting result:\n${lintingResult}`;
    }
    catch (error) {
        return `Failed to create file: ${error.message}`;
    }
});
exports.createFileHandler = createFileHandler;
