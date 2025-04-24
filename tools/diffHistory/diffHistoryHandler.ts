import { spawn } from "child_process";

async function diffHistoryHandler() {
  const command =
    "git log -p -n 5 --stat --pretty=format:'%h %ad | %s%d [%an]' --date=short | cat";

  let stderr = "";
  let stdout = "";

  return new Promise<string>((resolve) => {
    const child = spawn(command, { shell: true });
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    child.on("close", () => {
      if (stderr && stdout) resolve(stdout.split("\n\n")[0] + "\n\n" + stderr);
      else if (stderr) resolve(stderr);
      else resolve(stdout.split("\n\n")[0]);
    });
  });
}

export { diffHistoryHandler };
