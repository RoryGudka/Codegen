import { spawn } from "child_process";

interface ExecParams {
  command: string;
}

const execHandler = async ({ command }: ExecParams): Promise<string> => {
  let stderr = "";
  let stdout = "";

  return new Promise((resolve) => {
    const child = spawn(command, { shell: true });
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
  });
};

export { execHandler };
