import fs from "fs";
import ignore from "ignore";
import path from "path";
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

function findGitignore(dirPath: string): string | null {
  let currentDir = path.resolve(dirPath);

  while (currentDir !== "/") {
    const gitignorePath = path.join(currentDir, ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      return currentDir;
    }

    // Move up one directory
    const parentDir = path.resolve(currentDir, "..");
    if (parentDir === currentDir) break; // Reached root
    currentDir = parentDir;
  }
  return null; // No .gitignore found
}

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

    // Handle git-ignored files
    const workingDir = process.cwd();
    const gitignoreDir = findGitignore(workingDir);

    if (gitignoreDir) {
      const gitignorePath = path.join(gitignoreDir, ".gitignore");
      const gitignoreContent = fs.readFileSync(gitignorePath).toString();
      const ig = ignore().add(gitignoreContent);

      // We'll post-filter the results to exclude git-ignored files
      const { stdout, stderr, code } = await execAsync(rgPath, rgArgs, {});

      if (code !== 0 && stderr && !stdout) {
        return `Error: ${stderr}`;
      }

      if (!stdout) {
        return "No matches found.";
      }

      // Filter out git-ignored files from results
      const lines = stdout.trim().split("\n");
      const filteredLines = lines.filter((line) => {
        const parts = line.split(":", 1);
        if (parts.length === 0) return false;

        const filePath = parts[0];
        // Use the directory containing .gitignore as the base for relative paths
        const relativePath = path.relative(
          gitignoreDir,
          path.resolve(workingDir, filePath)
        );
        return !ig.ignores(relativePath);
      });

      // Format output to match ripgrep style
      const results = filteredLines.slice(0, 25).join("\n");

      return results || "No matches found.";
    } else {
      // No .gitignore found, proceed normally

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
    }
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

export { grepSearchHandler };
