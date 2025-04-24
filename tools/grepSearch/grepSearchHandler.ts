import { promisify } from "util";
import { rgPath } from "@vscode/ripgrep";
import { spawn } from "child_process";

const execAsync = promisify(
  (
    cmd: string,
    args: string[],
    options: any,
    callback: (
      error: Error | null,
      res: { stdout?: string; stderr?: string; code?: number | null }
    ) => void
  ) => {
    const proc = spawn(cmd, args, options);
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => (stdout += data));
    proc.stderr.on("data", (data) => (stderr += data));

    proc.on("close", (code) => {
      callback(null, { stdout, stderr, code });
    });

    proc.on("error", (err) => callback(err, {}));
  }
);

interface GrepSearchParams {
  query: string;
  caseSensitive?: boolean;
  includePattern?: string;
  excludePattern?: string;
  n?: number;
}

async function grepSearchHandler({
  query,
  caseSensitive = false,
  includePattern,
  excludePattern,
  n = 50,
}: GrepSearchParams): Promise<string> {
  try {
    // Build the ripgrep arguments
    const rgArgs = [`--max-count=${n}`, "--no-heading", "--line-number"];

    // Add case sensitivity flag
    if (!caseSensitive) {
      rgArgs.push("-i");
    }

    // Add include pattern
    if (includePattern) {
      rgArgs.push(`--glob`, includePattern);
    }

    // Add exclude pattern
    if (excludePattern) {
      rgArgs.push(`--glob`, `!${excludePattern}`);
    }

    // Add the search query and search in current directory
    rgArgs.push(query, ".");

    // Execute ripgrep using rgPath from @vscode/ripgrep
    const { stdout, stderr, code } = await execAsync(rgPath, rgArgs, {});

    if (code !== 0 && stderr && !stdout) {
      return `Error: ${stderr}`;
    }

    if (!stdout) {
      return "No matches found.";
    }

    // Format output to match ripgrep style
    const results = stdout.trim().split("\n").slice(0, 50).join("\n");

    return results || "No matches found.";
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

export { grepSearchHandler };
