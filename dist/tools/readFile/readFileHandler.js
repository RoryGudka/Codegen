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
exports.readFileHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readFileHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ filePath, }) {
    const fullFilePath = path_1.default.join(process.cwd(), filePath);
    if (!fs_1.default.existsSync(fullFilePath)) {
        return "File path does not exist. Try again with corrected file path.";
    }
    return fs_1.default.readFileSync(fullFilePath, "utf8");
});
exports.readFileHandler = readFileHandler;
