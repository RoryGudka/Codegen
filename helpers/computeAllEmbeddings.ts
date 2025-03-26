import fs from "fs";
import { getFileStructure } from "./getFileStructure";
import { get_encoding } from "tiktoken";
import { openai } from "../clients/openai";
import path from "path";
import { v4 as uuidv4 } from "uuid";

interface EmbeddingMap {
  [filePath: string]: {
    lastFileEditDate: string;
    embeddingFileIds: string[];
  };
}

async function cleanupEmbeddingMap(trackedFiles: string[]) {
  const mapPath = path.join(".codegen", "embeddings", "map.json");
  let embeddingMap: EmbeddingMap = {};

  if (fs.existsSync(mapPath)) {
    embeddingMap = JSON.parse(fs.readFileSync(mapPath, "utf-8"));

    // Check each file in the map against tracked files
    for (const filePath in embeddingMap) {
      if (!trackedFiles.includes(filePath)) {
        console.info(`Decomputed embeddings for ${filePath}`);
        // Remove associated embedding files
        for (const fileId of embeddingMap[filePath].embeddingFileIds) {
          const embeddingFilePath = path.join(
            ".codegen",
            "embeddings",
            `${fileId}.json`
          );
          if (fs.existsSync(embeddingFilePath)) {
            fs.unlinkSync(embeddingFilePath);
          }
        }
        // Remove the entry from the map
        delete embeddingMap[filePath];
      }
    }

    // Write updated map back to file
    fs.writeFileSync(mapPath, JSON.stringify(embeddingMap, null, 2));
  }

  return embeddingMap;
}

function addFilePathAndLineNumbers(
  filePath: string,
  content: string,
  start?: number
): string {
  const lines = content.split("\n");
  const updatedLines = lines.map(
    (line, index) => `${filePath}:${(start || 0) + index + 1}: ${line}`
  );
  return updatedLines.join("\n");
}

async function computeEmbeddings(
  filePath: string,
  start?: number,
  end?: number
): Promise<{ embeddings: number[][]; fileIds: string[] }> {
  const fileStats = fs.statSync(filePath);
  const lastEditDate = fileStats.mtime.toISOString();
  const mapPath = path.join(".codegen", "embeddings", "map.json");
  let embeddingMap: EmbeddingMap = {};

  // Load existing map if it exists
  if (fs.existsSync(mapPath)) {
    embeddingMap = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
  }

  const generateOutputPath = (id: string) =>
    path.join(".codegen", "embeddings", `${id}.json`);

  // Check if cached embeddings exist for this file
  if (
    embeddingMap[filePath] &&
    embeddingMap[filePath].embeddingFileIds.length > 0
  ) {
    const cachedEmbeddings: number[][] = [];
    let allUpToDate = true;

    for (const fileId of embeddingMap[filePath].embeddingFileIds) {
      const outputPath = generateOutputPath(fileId);
      if (fs.existsSync(outputPath)) {
        const cachedData = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
        if (cachedData.fileLastEditDate === lastEditDate) {
          cachedEmbeddings.push(cachedData.embeddings);
        } else {
          allUpToDate = false;
          break;
        }
      }
    }

    if (allUpToDate && cachedEmbeddings.length > 0) {
      return {
        embeddings: cachedEmbeddings,
        fileIds: embeddingMap[filePath].embeddingFileIds,
      };
    }
  }

  // Only compute content and tokens if needed
  const raw = fs.readFileSync(filePath, "utf-8");
  const split = raw.split("\n");
  const total = split.length;
  const mid = ((end || total) - (start || 0)) / 2 + (start || 0);
  const selected = split.slice(start || 0, end || total).join("\n");
  const content = addFilePathAndLineNumbers(filePath, selected, start);
  const encoding = get_encoding("cl100k_base");
  const tokens = encoding.encode(content).length;

  if (tokens > 8191) {
    const first = await computeEmbeddings(filePath, start || 0, mid);
    const last = await computeEmbeddings(filePath, mid, end || total);
    return {
      embeddings: [...first.embeddings, ...last.embeddings],
      fileIds: [...first.fileIds, ...last.fileIds],
    };
  }

  const fileId = uuidv4();
  const outputPath = generateOutputPath(fileId);

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: content,
  });
  const embedding = response.data[0].embedding;
  console.info("Computed embeddings for", filePath);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const outputData = {
    fileLastEditDate: lastEditDate,
    embeddings: embedding,
  };
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

  // Update the embedding map
  embeddingMap[filePath] = {
    lastFileEditDate: lastEditDate,
    embeddingFileIds: embeddingMap[filePath]?.embeddingFileIds
      ? [...embeddingMap[filePath].embeddingFileIds, fileId]
      : [fileId],
  };
  fs.writeFileSync(mapPath, JSON.stringify(embeddingMap, null, 2));

  return { embeddings: [embedding], fileIds: [fileId] };
}

export async function computeAllEmbeddings() {
  const files = await getFileStructure().split("\n");
  // Clean up the embedding map before processing files
  await cleanupEmbeddingMap(files);

  for (const file of files) {
    await computeEmbeddings(file);
  }
}
