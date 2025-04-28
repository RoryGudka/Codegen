import { createFileHandler } from "../tools/createFile/createFileHandler";
import { deleteFileHandler } from "../tools/deleteFile/deleteFileHandler";
import { diffHistoryHandler } from "../tools/diffHistory/diffHistoryHandler";
import { editFileHandler } from "../tools/editFile/editFileHandler";
import { editMemoryFileHandler } from "../tools/editMemoryFile/editMemoryFileHandler";
import { endTaskHandler } from "../tools/endTask/endTaskHandler";
import { execHandler } from "../tools/exec/execHandler";
import { fileSearchHandler } from "../tools/fileSearch/fileSearchHandler";
import { grepSearchHandler } from "../tools/grepSearch/grepSearchHandler";
import { listDirHandler } from "../tools/listDir/listDirHandler";
import { moveFileHandler } from "../tools/moveFile/moveFileHandler";
import { readFileHandler } from "../tools/readFile/readFileHandler";
import { renameFileHandler } from "../tools/renameFile/renameFileHandler";
import { searchTheWebHandler } from "../tools/searchTheWeb/searchTheWebHandler";
import { semanticSearchHandler } from "../tools/semanticSearch/semanticSearchHandler";

const toolHandlers = {
  readFile: readFileHandler,
  editFile: editFileHandler,
  createFile: createFileHandler,
  deleteFile: deleteFileHandler,
  moveFile: moveFileHandler,
  renameFile: renameFileHandler,
  editMemoryFile: editMemoryFileHandler,
  searchTheWeb: searchTheWebHandler,
  exec: execHandler,
  endTask: endTaskHandler,
  diffHistory: diffHistoryHandler,
  fileSearch: fileSearchHandler,
  grepSearch: grepSearchHandler,
  semanticSearch: semanticSearchHandler,
  listDir: listDirHandler,
};

export { toolHandlers };
