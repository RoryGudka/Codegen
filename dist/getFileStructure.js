"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileStructure = getFileStructure;
const fs_1 = __importDefault(require("fs"));
const ignore_1 = __importDefault(require("ignore"));
const path_1 = __importDefault(require("path"));
function getFileStructure() {
    const ig = (0, ignore_1.default)();
    // Read .gitignore if it exists
    try {
        const gitignore = fs_1.default.readFileSync(".gitignore", "utf8");
        ig.add(gitignore);
    }
    catch (error) {
        // No .gitignore file, that's fine
    }
    function walkDir(dir, indent = "") {
        let structure = "";
        const files = fs_1.default.readdirSync(dir);
        for (const file of files) {
            const fullPath = path_1.default.join(dir, file);
            const relativePath = path_1.default.relative(process.cwd(), fullPath);
            // Skip if file/directory is ignored by .gitignore
            if (ig.ignores(relativePath)) {
                continue;
            }
            const stats = fs_1.default.statSync(fullPath);
            if (stats.isDirectory()) {
                structure += `${indent}${file}/\n`;
                structure += walkDir(fullPath, indent + "  ");
            }
            else {
                structure += `${indent}${file}\n`;
            }
        }
        return structure;
    }
    return walkDir(".");
}
