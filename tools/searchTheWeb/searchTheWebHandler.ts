import { tvly } from "../../clients/tavily";

interface SearchTheWebParams {
  query: string;
}

const searchTheWebHandler = async ({ query }: SearchTheWebParams) => {
  try {
    const response = await tvly.search(query, { searchDepth: "advanced" });
    return JSON.stringify(response, null, 2);
  } catch (error: any) {
    return `An error occurred: ${error.message}`;
  }
};

export { searchTheWebHandler };
