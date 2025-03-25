import { createFileHandler } from "../tools/createFile/createFileHandler";
import { deleteFileHandler } from "../tools/deleteFile/deleteFileHandler";
import { editContextFileHandler } from "../tools/editContextFile/editContextFileHandler";
import { editFileHandler } from "../tools/editFile/editFileHandler";
import { endTaskHandler } from "../tools/endTask/endTaskHandler";
import { execHandler } from "../tools/exec/execHandler";
import { moveFileHandler } from "../tools/moveFile/moveFileHandler";
import { readFileHandler } from "../tools/readFile/readFileHandler";
import { renameFileHandler } from "../tools/renameFile/renameFileHandler";
import { searchFilesForKeywordHandler } from "../tools/searchFilesForKeyword/searchFilesForKeywordHandler";
import { searchTheWebHandler } from "../tools/searchTheWeb/searchTheWebHandler";

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

export { toolHandlers };
