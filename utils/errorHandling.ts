export class AssistantError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AssistantError";
  }
}

export function handleError(error: unknown): never {
  if (error instanceof AssistantError) {
    console.error(`[${error.code}] ${error.message}`);
    if (error.details) {
      console.error("Details:", error.details);
    }
  } else if (error instanceof Error) {
    console.error("Unexpected error:", error.message);
  } else {
    console.error("Unknown error:", error);
  }
  process.exit(1);
}
