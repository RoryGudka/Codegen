/**
 * Help functionality for the Codegen CLI
 * Displays available commands and general information
 */

/**
 * Displays help information for the Codegen CLI
 * @returns A string containing the help text
 */
export function getHelpText(): string {
  return [
    `Codegen - A tool to manage and modify large codebases\n`,
    `Available commands:\n`,
    `  codegen configure - Setup credentials for OpenAI and Tavily`,
    `  codegen embeddings - Generate a vector store for the codebase files`,
    `  codegen gen - Modify files in the codebase based on a provided command input`,
    `  codegen view - Launch a local web server to render output files`,
    `\nFor more detailed information, visit: https://github.com/rorygudka/codegen`,
  ].join("\n");
}

/**
 * Displays the help information to the console and exits the process
 */
export function help(): void {
  console.log(getHelpText());
  process.exit(0);
}

/**
 * Checks if the given command is a help command
 * @param command The command to check
 * @returns True if the command is a help command, false otherwise
 */
export function isHelpCommand(command: string | undefined): boolean {
  return !!command && command.includes("help");
}
