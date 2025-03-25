"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContextFile = getContextFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getContextFile() {
    const filePath = path_1.default.join(__dirname, ".codegen", "context.txt");
    try {
        const data = fs_1.default.readFileSync(filePath, "utf8");
        return data;
    }
    catch (error) {
        if (error.code === "ENOENT") {
            return "Context has not been initialized for this codebase yet.";
        }
        else {
            return `Error: An error occurred while reading the file: ${error.message}`;
        }
    }
}
