const { editFileTool } = require("../tools/editFile/editFileTool");
const {
  editContextFileTool,
} = require("../tools/editContextFile/editContextFileTool");
const { createFileTool } = require("../tools/createFile/createFileTool");
const {
  searchFilesForKeywordTool,
} = require("../tools/searchFilesForKeyword/searchFilesForKeywordTool");
const { readFileTool } = require("../tools/readFile/readFileTool");
const { moveFileTool } = require("../tools/moveFile/moveFileTool");
const { deleteFileTool } = require("../tools/deleteFile/deleteFileTool");
const { renameFileTool } = require("../tools/renameFile/renameFileTool");
const {
  searchTheWebTool,
} = require("../tools/searchTheWeb/searchTheWebHandler");
const { execTool } = require("../tools/exec/execTool");

const tools = [
  readFileTool,
  editFileTool,
  createFileTool,
  deleteFileTool,
  moveFileTool,
  renameFileTool,
  editContextFileTool,
  searchFilesForKeywordTool,
  searchTheWebTool,
  execTool,
];

module.exports = { tools };
