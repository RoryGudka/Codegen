import { ChatCompletionTool } from "openai/resources";
import { createFileTool } from "../tools/createFile/createFileTool";
import { deleteFileTool } from "../tools/deleteFile/deleteFileTool";
import { diffHistoryTool } from "../tools/diffHistory/diffHistoryTool";
import { editFileTool } from "../tools/editFile/editFileTool";
import { editMemoryFileTool } from "../tools/editMemoryFile/editMemoryFileTool";
import { endTaskTool } from "../tools/endTask/endTaskTool";
import { execTool } from "../tools/exec/execTool";
import { fileSearchTool } from "../tools/fileSearch/fileSearchTool";
import { grepSearchTool } from "../tools/grepSearch/grepSearchTool";
import { listDirTool } from "../tools/listDir/listDirTool";
import { moveFileTool } from "../tools/moveFile/moveFileTool";
import { readFileTool } from "../tools/readFile/readFileTool";
import { renameFileTool } from "../tools/renameFile/renameFileTool";
import { searchTheWebTool } from "../tools/searchTheWeb/searchTheWebTool";
import { semanticSearchTool } from "../tools/semanticSearch/semanticSearchTool";

export const tools: ChatCompletionTool[] = [
  readFileTool,
  createFileTool,
  editFileTool,
  deleteFileTool,
  moveFileTool,
  renameFileTool,
  execTool,
  endTaskTool,
  searchTheWebTool,
  editMemoryFileTool,
  diffHistoryTool,
  fileSearchTool,
  grepSearchTool,
  semanticSearchTool,
  listDirTool,
];
