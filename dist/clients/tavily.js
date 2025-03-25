"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tvly = void 0;
const { tavily } = require("@tavily/core");
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
exports.tvly = tvly;
