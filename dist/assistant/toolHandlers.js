"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolHandlers = void 0;
const createFileHandler_1 = require("../tools/createFile/createFileHandler");
const deleteFileHandler_1 = require("../tools/deleteFile/deleteFileHandler");
const editContextFileHandler_1 = require("../tools/editContextFile/editContextFileHandler");
const editFileHandler_1 = require("../tools/editFile/editFileHandler");
const endTaskHandler_1 = require("../tools/endTask/endTaskHandler");
const execHandler_1 = require("../tools/exec/execHandler");
const moveFileHandler_1 = require("../tools/moveFile/moveFileHandler");
const readFileHandler_1 = require("../tools/readFile/readFileHandler");
const renameFileHandler_1 = require("../tools/renameFile/renameFileHandler");
const searchFilesForKeywordHandler_1 = require("../tools/searchFilesForKeyword/searchFilesForKeywordHandler");
const searchTheWebHandler_1 = require("../tools/searchTheWeb/searchTheWebHandler");
const toolHandlers = {
    readFile: readFileHandler_1.readFileHandler,
    editFile: editFileHandler_1.editFileHandler,
    createFile: createFileHandler_1.createFileHandler,
    deleteFile: deleteFileHandler_1.deleteFileHandler,
    moveFile: moveFileHandler_1.moveFileHandler,
    renameFile: renameFileHandler_1.renameFileHandler,
    editContextFile: editContextFileHandler_1.editContextFileHandler,
    searchFilesForKeyword: searchFilesForKeywordHandler_1.searchFilesForKeywordHandler,
    searchTheWeb: searchTheWebHandler_1.searchTheWebHandler,
    exec: execHandler_1.execHandler,
    endTask: endTaskHandler_1.endTaskHandler,
};
exports.toolHandlers = toolHandlers;
