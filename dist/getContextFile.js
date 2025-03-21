"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContextFile = getContextFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getContextFile() {
    const contextFilePath = path_1.default.join(process.cwd(), ".codegen/context.txt");
    try {
        if (fs_1.default.existsSync(contextFilePath)) {
            return fs_1.default.readFileSync(contextFilePath, "utf8");
        }
    }
    catch (error) {
        console.error("Error reading context file:", error);
    }
    return "";
}
