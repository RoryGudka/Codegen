import { exec } from "child_process";

interface ExecParams {
  command: string;
}

const execHandler = async ({ command }: ExecParams): Promise<string> => {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) resolve(`ERROR: ${error.message}`);
      else if (stderr) resolve(`ERROR: ${stderr}`);
      else return resolve(stdout);
    });
  });
};

export { execHandler };
