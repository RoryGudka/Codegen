import fs from "fs";
import { openai } from "../clients/openai";
import path from "path";

interface EmbeddingMap {
  [filePath: string]: {
    lastFileEditDate: string;
    embeddingFileIds: string[];
  };
}

interface SimilarityResult {
  filePath: string;
  embeddingFileId: string;
  similarity: number;
}

// Cosine similarity function
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function computeStringEmbedding(input: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input,
  });
  return response.data[0].embedding;
}

async function compareStringToEmbeddings(inputString: string) {
  // Compute embedding for the input string
  const inputEmbedding = await computeStringEmbedding(inputString);

  const mapPath = path.join(".codegen", "embeddings", "map.json");
  if (!fs.existsSync(mapPath)) {
    console.warn("No embedding map found at", mapPath);
    return [];
  }

  // Load the embedding map
  const embeddingMap: EmbeddingMap = JSON.parse(
    fs.readFileSync(mapPath, "utf-8")
  );
  const results: SimilarityResult[] = [];

  // Compare against all embeddings
  for (const filePath in embeddingMap) {
    const { embeddingFileIds } = embeddingMap[filePath];

    for (const fileId of embeddingFileIds) {
      const embeddingPath = path.join(
        ".codegen",
        "embeddings",
        `${fileId}.json`
      );
      if (fs.existsSync(embeddingPath)) {
        const embeddingData = JSON.parse(
          fs.readFileSync(embeddingPath, "utf-8")
        );
        const storedEmbedding = embeddingData.embeddings;

        const similarity = cosineSimilarity(inputEmbedding, storedEmbedding);
        results.push({
          filePath,
          embeddingFileId: fileId,
          similarity,
        });
      }
    }
  }

  // Sort results by similarity (highest to lowest)
  results.sort((a, b) => b.similarity - a.similarity);

  return results;
}

async function getEmbeddingSimilarity(input: string, n: number) {
  const similarities = await compareStringToEmbeddings(input);
  const set = new Set<string>();
  for (let i = 0; i < similarities.length && set.size < n; i++) {
    set.add(similarities[i].filePath);
  }
  return Array.from(set);
}

async function getMostRelevantFiles(input: string, n: number) {
  console.time("embeddings");
  const filePaths = await getEmbeddingSimilarity(input, n);
  const files = filePaths.map(
    (path) => [path, fs.readFileSync(path, "utf-8")] as [string, string]
  );
  console.timeEnd("embeddings");
  return files;
}

export { getMostRelevantFiles };
