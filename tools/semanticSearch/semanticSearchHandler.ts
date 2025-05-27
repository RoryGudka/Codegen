import { getMostRelevantFiles } from "../../helpers/getEmbeddingSimilarity";

interface SemanticSearchParams {
  query: string;
}

async function semanticSearchHandler({
  query,
}: SemanticSearchParams): Promise<string> {
  try {
    const files = await getMostRelevantFiles(query, 5);
    return files
      .map(([filePath, content]) => `File: ${filePath}\nContent:\n${content}`)
      .join("\n\n");
  } catch (error) {
    return `Error: ${error}`;
  }
}

export { semanticSearchHandler };
