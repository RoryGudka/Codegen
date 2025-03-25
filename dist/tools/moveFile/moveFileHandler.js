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
exports.moveFileHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const runEslint_1 = require("../../helpers/runEslint");
const moveFileHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ sourcePath, destinationPath, }) {
    const fullSourcePath = path_1.default.join(process.cwd(), sourcePath);
    const fullDestinationPath = path_1.default.join(process.cwd(), destinationPath);
    if (!fs_1.default.existsSync(fullSourcePath)) {
        return "Source file does not exist. Cannot move non-existent file.";
    }
    try {
        const destDir = path_1.default.dirname(fullDestinationPath);
        if (!fs_1.default.existsSync(destDir)) {
            fs_1.default.mkdirSync(destDir, { recursive: true });
        }
        fs_1.default.renameSync(fullSourcePath, fullDestinationPath);
        // Run ESLint on the moved file if it's a JavaScript/TypeScript file
        if (fullDestinationPath.match(/\.(js|ts)x?$/)) {
            const lintingResult = yield (0, runEslint_1.runEslintOnFile)(fullDestinationPath);
            return `File moved successfully.\nLinting result:\n${lintingResult}`;
        }
        return "File moved successfully.";
    }
    catch (error) {
        return `Failed to move file: ${error.message}`;
    }
});
exports.moveFileHandler = moveFileHandler;
