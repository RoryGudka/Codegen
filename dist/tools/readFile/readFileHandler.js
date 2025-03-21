"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileHandler = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const readFileHandler = async ({ filePath, }) => {
    const fullFilePath = path_1.default.join(process.cwd(), filePath);
    if (!fs_1.default.existsSync(fullFilePath)) {
        return "File path does not exist. Try again with corrected file path.";
    }
    try {
        const fileContent = fs_1.default.readFileSync(fullFilePath, "utf8");
        return fileContent;
    }
    catch (error) {
        console.error("Error reading file:", error);
        throw error;
    }
};
exports.readFileHandler = readFileHandler;
