import { getMostRelevantFiles } from "../../helpers/getEmbeddingSimilarity";

interface GetMostRelevantFilesParams {
  inputString: string;
  n: number;
}

async function getMostRelevantFilesHandler({
  inputString,
  n,
}: GetMostRelevantFilesParams): Promise<string> {
  try {
    const files = await getMostRelevantFiles(inputString, n);
    return files
      .map(([filePath, content]) => `File: ${filePath}\nContent:\n${content}`)
      .join("\n\n");
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

export { getMostRelevantFilesHandler };
