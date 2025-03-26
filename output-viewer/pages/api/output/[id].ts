import { NextApiRequest, NextApiResponse } from "next";

import path from "path";
import { readFile } from "fs/promises";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    const filePath = path.join(
      process.cwd(),
      "../.codegen/outputs",
      `output-${id}.txt`
    );
    const content = await readFile(filePath, "utf-8");
    res.status(200).json({ content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "File not found or read error" });
  }
}
