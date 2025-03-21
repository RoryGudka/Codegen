import type { OpenAI } from "openai";

export interface FunctionParameters {
  type: "object";
  properties: Record<
    string,
    {
      type: string;
      description: string;
      items?: {
        type: string;
        description: string;
      };
    }
  >;
  required: string[];
}

export interface AssistantFunctionTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: FunctionParameters;
  };
}

export type AssistantTool = OpenAI.Beta.Assistants.AssistantTool;
