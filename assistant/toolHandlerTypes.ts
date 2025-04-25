import { MessageParam } from "@anthropic-ai/sdk/resources";

export type ToolHandler<T = any> = (
  args: T,
  messages?: MessageParam[],
) => Promise<string>;

export interface ToolHandlers {
  [name: string]: ToolHandler;
}
