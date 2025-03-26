import { OpenAI } from "openai";

export interface AssistantMessageContent {
  type: "text";
  text: {
    value: string;
    annotations: Array<unknown>;
  };
}

export interface AssistantMessage {
  role: "assistant" | "user";
  content: AssistantMessageContent[];
  thread_id: string;
  id: string;
  created_at: number;
  assistant_id?: string;
  run_id?: string;
  file_ids: string[];
}

export type AssistantStatus =
  | "queued"
  | "in_progress"
  | "completed"
  | "failed"
  | "cancelled"
  | "requires_action"
  | "expired";

export type AssistantRun = OpenAI.Beta.Threads.Runs.Run;

export interface AssistantToolParameter {
  type: string;
  description?: string;
  enum?: string[];
}

export interface AssistantToolFunction {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, AssistantToolParameter>;
    required: string[];
  };
}

export interface AssistantTool {
  type: "function";
  function: AssistantToolFunction;
}

export type Assistant = OpenAI.Beta.Assistant;
