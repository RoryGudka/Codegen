import { getMostRelevantFiles } from "../../helpers/getEmbeddingSimilarity";

interface GetFilesSimilarToStringParams {
  inputString: string;
  n: number;
}

async function getFilesSimilarToStringHandler({
  inputString,
  n,
}: GetFilesSimilarToStringParams): Promise<string> {
  try {
    const files = await getMostRelevantFiles(inputString, n);
    return files
      .map(([filePath, content]) => `File: ${filePath}\nContent:\n${content}`)
      .join("\n\n");
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

export { getFilesSimilarToStringHandler };