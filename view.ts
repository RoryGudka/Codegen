import { execSync } from "child_process";

execSync(`npx next dev -p 5000 --turbo`, { cwd: "output-viewer" });

process.exit(0);
