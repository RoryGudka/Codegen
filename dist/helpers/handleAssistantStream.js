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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAssistantStream = handleAssistantStream;
/**
 * Streams an assistant's response to a file in the outputs directory
 * @param {AsyncIterable<any>} stream - The assistant's response stream
 * @param {string} id - Unique identifier for the output file
 * @param {Function} handleToolCall - Optional function to handle tool calls
 * @returns {Promise<string>} - Total content of stream output
 */
function handleAssistantStream(stream_1, id_1) {
    return __awaiter(this, arguments, void 0, function* (stream, id, handleToolCall = null) {
        var _a, stream_2, stream_2_1;
        var _b, e_1, _c, _d;
        var _e, _f, _g, _h, _j, _k;
        let str = "";
        try {
            try {
                for (_a = true, stream_2 = __asyncValues(stream); stream_2_1 = yield stream_2.next(), _b = stream_2_1.done, !_b; _a = true) {
                    _d = stream_2_1.value;
                    _a = false;
                    const chunk = _d;
                    if ((_g = (_f = (_e = chunk.choices) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.delta) === null || _g === void 0 ? void 0 : _g.content) {
                        const content = chunk.choices[0].delta.content;
                        str += content;
                    }
                    if (handleToolCall && ((_k = (_j = (_h = chunk.choices) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.delta) === null || _k === void 0 ? void 0 : _k.tool_calls)) {
                        yield handleToolCall(chunk.choices[0].delta.tool_calls);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = stream_2.return)) yield _c.call(stream_2);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (error) {
            console.error("Error while streaming:", error);
            throw error;
        }
        return str;
    });
}
module.exports = { handleAssistantStream };
