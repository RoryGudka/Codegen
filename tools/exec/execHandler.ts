import { exec as execCallback } from "child_process";
import { promisify } from "util";

interface ExecParams {
  command: string;
}

interface ExecResult {
  stdout: string;
  stderr: string;
}

const exec = promisify(execCallback);

const execHandler = async ({ command }: ExecParams): Promise<string> => {
  try {
    const { stdout, stderr }: ExecResult = await exec(command);
    if (stderr) {
      return `ERROR: ${stderr}`;
    }
    return stdout;
  } catch (error) {
    return `ERROR: ${(error as Error).message}`;
  }
};

export { execHandler };
