import fuzzysort from "fuzzysort";
import { getFileStructure } from "../../helpers/getFileStructure";

interface FileSearchParams {
  query: string;
  explanation: string;
}

function fileSearchHandler({ query }: FileSearchParams): string {
  const files = getFileStructure().split("\n");

  console.log(query);

  console.log(files);
  // Perform fuzzy search
  const results = fuzzysort.go(query, files, {
    limit: 10, // Cap results at 10
  });
  console.log(results);

  // Extract matched file paths from results
  const matchedFiles = results.map((result) => result.target);
  console.log(matchedFiles);

  return matchedFiles.join("\n");
}

export { fileSearchHandler };
