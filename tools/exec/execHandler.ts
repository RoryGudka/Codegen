import { exec } from "child_process";

interface ExecParams {
  command: string;
}

const execHandler = async ({ command }: ExecParams): Promise<string> => {
  return new Promise((resolve) => {
    exec(command, (_, stdout, stderr) => {
      if (stderr) resolve(`ERROR: ${stderr}`);
      else return resolve(stdout);
    });
  });
};

export { execHandler };
