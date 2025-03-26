import { execSync } from "child_process";

console.log("Starting server at http://localhost:5000");
execSync(`npx next dev -p 5000 --turbo`, { cwd: "output-viewer" });

process.exit(0);
