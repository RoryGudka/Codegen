import { spawn } from "child_process";

interface ExecParams {
  command: string;
  isBackground: boolean;
}

const execHandler = async ({
  command,
  isBackground,
}: ExecParams): Promise<string> => {
  try {
    let stderr = "";
    let stdout = "";

    return new Promise((resolve) => {
      const child = spawn(command, { shell: true });
      if (isBackground) {
        resolve("Command running in background");
      } else {
        child.stderr.on("data", (data) => {
          stderr += data.toString();
        });
        child.stdout.on("data", (data) => {
          stdout += data.toString();
        });
        child.on("close", () => {
          if (stderr && stdout) resolve(stdout + "\n\n" + stderr);
          else if (stderr) resolve(stderr);
          else resolve(stdout);
        });
      }
    });
  } catch (e) {
    return `Error: ${e}`;
  }
};

export { execHandler };
