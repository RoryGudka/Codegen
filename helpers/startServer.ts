import WebSocket from "ws";
import express from "express";
import fs from "fs";
import path from "path";

// Extract server functionality to be reused by both gen and view
export const startServer = async () => {
  return new Promise<{
    app: express.Express;
    server: any;
  }>((resolve) => {
    const currentWorkingDirectory = process.cwd();
    const app = express();
    const PORT = 5000;
    const OUTPUT_DIR = path.join(
      currentWorkingDirectory,
      ".codegen",
      "outputs"
    );
    const viewHtml = fs.readFileSync(
      path.join(__dirname, "../..", "view.html"),
      "utf8"
    );

    app.get("/:id", (req, res) => {
      res.send(viewHtml);
    });

    const server = app.listen(PORT, () =>
      console.info(`Server running at http://localhost:${PORT}`)
    );
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws, req) => {
      const id = req.url?.split("?")[1]?.split("=")[1];
      console.info("Client connected");

      const sendUpdates = () => {
        const filePath = path.join(OUTPUT_DIR, `output-${id}.txt`);
        fs.readFile(filePath, "utf8", (err, data) => {
          if (!err) ws.send(data);
        });
      };

      sendUpdates();

      const watcher = fs.watch(OUTPUT_DIR, sendUpdates);

      ws.on("close", () => watcher.close()); // Cleanup when client disconnects
    });

    resolve({ app, server });
  });
};
