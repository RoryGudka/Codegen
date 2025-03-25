import { ChatCompletionTool } from "openai/resources/chat";

export interface FileOperationResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface ToolHandler<T> {
  (params: T): Promise<string>;
}

export interface BaseTool extends ChatCompletionTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, unknown>;
      required: string[];
    };
  };
}
