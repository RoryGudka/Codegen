"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileStructure = getFileStructure;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ignore_1 = __importDefault(require("ignore"));
function getFileStructure(dir = ".") {
    let result = "";
    try {
        // Load .gitignore patterns
        const gitignorePath = path_1.default.join(dir, ".gitignore");
        let ig = (0, ignore_1.default)();
        if (fs_1.default.existsSync(gitignorePath)) {
            const gitignoreContent = fs_1.default.readFileSync(gitignorePath).toString();
            ig = ig.add(gitignoreContent);
        }
        const files = fs_1.default.readdirSync(dir);
        for (const file of files) {
            if (file.startsWith(".") || file === "node_modules")
                continue;
            const filePath = path_1.default.join(dir, file);
            const stats = fs_1.default.statSync(filePath);
            // Skip files and directories that are ignored by .gitignore
            const relativePath = path_1.default.relative(dir, filePath);
            if (ig.ignores(relativePath)) {
                continue;
            }
            if (stats.isDirectory()) {
                result += `📁 ${filePath}\n`;
                result += getFileStructure(filePath);
            }
            else {
                result += `📄 ${filePath}\n`;
            }
        }
    }
    catch (error) {
        console.error(`Error reading directory: ${error}`);
    }
    return result;
}
