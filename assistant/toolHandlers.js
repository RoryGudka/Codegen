const { editFileHandler } = require("../tools/editFile/editFileHandler");
const {
  editContextFileHandler,
} = require("../tools/editContextFile/editContextFileHandler");
const { createFileHandler } = require("../tools/createFile/createFileHandler");
const {
  searchFilesForKeywordHandler,
} = require("../tools/searchFilesForKeyword/searchFilesForKeywordHandler");
const { readFileHandler } = require("../tools/readFile/readFileHandler");
const { moveFileHandler } = require("../tools/moveFile/moveFileHandler");
const { deleteFileHandler } = require("../tools/deleteFile/deleteFileHandler");
const { renameFileHandler } = require("../tools/renameFile/renameFileHandler");
const {
  searchTheWebHandler,
} = require("../tools/searchTheWeb/searchTheWebHandler");
const { execHandler } = require("../tools/exec/execHandler");
const { endTaskHandler } = require("../tools/endTask/endTaskHandler");

const toolHandlers = {
  readFile: readFileHandler,
  editFile: editFileHandler,
  createFile: createFileHandler,
  deleteFile: deleteFileHandler,
  moveFile: moveFileHandler,
  renameFile: renameFileHandler,
  editContextFile: editContextFileHandler,
  searchFilesForKeyword: searchFilesForKeywordHandler,
  searchTheWeb: searchTheWebHandler,
  exec: execHandler,
  endTask: endTaskHandler,
};

module.exports = { toolHandlers };
