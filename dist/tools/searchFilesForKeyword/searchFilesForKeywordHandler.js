"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFilesForKeyword = searchFilesForKeyword;
exports.searchFilesForKeywordHandler = searchFilesForKeywordHandler;
const fs_1 = __importDefault(require("fs"));
const ignore_1 = __importDefault(require("ignore"));
const path_1 = __importDefault(require("path"));
function searchFilesForKeyword(searchString, dirPath = ".") {
    let foundFiles = [];
    try {
        // Load .gitignore patterns
        const gitignorePath = path_1.default.join(dirPath, ".gitignore");
        let ig = (0, ignore_1.default)();
        if (fs_1.default.existsSync(gitignorePath)) {
            const gitignoreContent = fs_1.default.readFileSync(gitignorePath, "utf8");
            ig = ig.add(gitignoreContent);
        }
        const files = fs_1.default.readdirSync(dirPath);
        for (const file of files) {
            if (file.startsWith(".") || file === "node_modules")
                continue;
            const filePath = path_1.default.join(dirPath, file);
            const stats = fs_1.default.statSync(filePath);
            // Skip files and directories that are ignored by .gitignore
            const relativePath = path_1.default.relative(dirPath, filePath);
            if (ig.ignores(relativePath))
                continue;
            if (stats.isDirectory()) {
                foundFiles = foundFiles.concat(searchFilesForKeyword(searchString, filePath));
            }
            else {
                const content = fs_1.default.readFileSync(filePath, "utf8");
                const lines = content.split("\n");
                const matchingLines = lines.filter((line) => line.toLowerCase().includes(searchString.toLowerCase()));
                if (matchingLines.length > 0) {
                    foundFiles.push({
                        file: filePath,
                        matches: matchingLines.length,
                        lines: matchingLines,
                    });
                }
            }
        }
    }
    catch (error) {
        console.error(`Error processing directory ${dirPath}: ${error.message}`);
    }
    return foundFiles;
}
function searchFilesForKeywordHandler({ keyword, }) {
    return searchFilesForKeyword(keyword, ".");
}
module.exports = {
    searchFilesForKeywordHandler,
};
