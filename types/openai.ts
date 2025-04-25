/**
 * Import types from the OpenAI SDK.
 */
import { OpenAI } from "openai";

/**
 * Interface representing the content of an assistant message.
 * Currently only supports text messages with optional annotations.
 */
export interface AssistantMessageContent {
  type: "text";
  text: {
    value: string;
    annotations: Array<unknown>;
  };
}

/**
 * Interface representing a message in an assistant conversation.
 * Contains the message role (assistant or user), content, and various identifiers.
 */
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

/**
 * Type representing the possible states of an assistant operation.
 * Used to track the progress and outcome of assistant interactions.
 */
export type AssistantStatus =
  | "queued"
  | "in_progress"
  | "completed"
  | "failed"
  | "cancelled"
  | "requires_action"
  | "expired";

/**
 * Type alias for the OpenAI Assistant Run object.
 * Represents an execution of an assistant within a thread.
 */
export type AssistantRun = OpenAI.Beta.Threads.Runs.Run;

/**
 * Interface defining a parameter for an assistant tool function.
 * Includes the parameter type, optional description, and possible enum values.
 */
export interface AssistantToolParameter {
  type: string;
  description?: string;
  enum?: string[];
}

/**
 * Interface defining a function that can be called by an assistant.
 * Includes the function name, description, and parameter specifications.
 */
export interface AssistantToolFunction {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, AssistantToolParameter>;
    required: string[];
  };
}

/**
 * Interface defining a tool that an assistant can use.
 * Currently only supports function-type tools.
 */
export interface AssistantTool {
  type: "function";
  function: AssistantToolFunction;
}

/**
 * Type alias for the OpenAI Assistant object.
 * Represents a configured assistant with specific capabilities and instructions.
 */
export type Assistant = OpenAI.Beta.Assistant;
