"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistantError = void 0;
exports.handleError = handleError;
class AssistantError extends Error {
    constructor(message, code, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = "AssistantError";
    }
}
exports.AssistantError = AssistantError;
function handleError(error) {
    if (error instanceof AssistantError) {
        console.error(`[${error.code}] ${error.message}`);
        if (error.details) {
            console.error("Details:", error.details);
        }
    }
    else if (error instanceof Error) {
        console.error("Unexpected error:", error.message);
    }
    else {
        console.error("Unknown error:", error);
    }
    process.exit(1);
}
