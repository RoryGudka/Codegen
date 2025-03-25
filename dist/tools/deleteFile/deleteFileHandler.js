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
exports.deleteFileHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const deleteFileHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ deleteFilePath }) {
    const fullDeleteFilePath = path_1.default.join(process.cwd(), deleteFilePath);
    if (!fs_1.default.existsSync(fullDeleteFilePath)) {
        return "File path does not exist. Unable to delete non-existent file.";
    }
    try {
        fs_1.default.unlinkSync(fullDeleteFilePath);
        return "File deleted successfully.";
    }
    catch (error) {
        return `Failed to delete file. Error: ${error.message}`;
    }
});
exports.deleteFileHandler = deleteFileHandler;
