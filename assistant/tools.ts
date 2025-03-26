import { ChatCompletionTool } from "openai/resources";
import { createFileTool } from "../tools/createFile/createFileTool";
import { deleteFileTool } from "../tools/deleteFile/deleteFileTool";
import { editContextFileTool } from "../tools/editContextFile/editContextFileTool";
import { editFileTool } from "../tools/editFile/editFileTool";
import { endTaskTool } from "../tools/endTask/endTaskTool";
import { execTool } from "../tools/exec/execTool";
import { moveFileTool } from "../tools/moveFile/moveFileTool";
import { readFileTool } from "../tools/readFile/readFileTool";
import { renameFileTool } from "../tools/renameFile/renameFileTool";
import { searchFilesForKeywordTool } from "../tools/searchFilesForKeyword/searchFilesForKeywordTool";
import { searchTheWebTool } from "../tools/searchTheWeb/searchTheWebTool";
import { getFilesSimilarToStringTool } from "../tools/getFilesSimilarToString/getFilesSimilarToStringTool";

export const tools: ChatCompletionTool[] = [
  readFileTool,
  createFileTool,
  editFileTool,
  deleteFileTool,
  moveFileTool,
  renameFileTool,
  execTool,
  endTaskTool,
  searchFilesForKeywordTool,
  searchTheWebTool,
  editContextFileTool,
  getFilesSimilarToStringTool,
];
