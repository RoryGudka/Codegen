import { MessageParam } from "@anthropic-ai/sdk/resources";
import fs from "fs";
import { getRelevantFileContent } from "../../helpers/getRelevantFileContent";
import path from "path";

interface ReadFileParams {
  filePath: string;
  disableTruncation: boolean;
}

const readFileHandler = async (
  { filePath, disableTruncation }: ReadFileParams,
  messages: MessageParam[]
): Promise<string> => {
  const fullFilePath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullFilePath)) {
    return "File path does not exist. Try again with corrected file path.";
  }

  const content = fs.readFileSync(fullFilePath, "utf8");
  const lines = content.split("\n");
  const numberedContent = lines
    .map((line, index) => `${index + 1}. ${line}`)
    .join("\n");

  // Use AI to get relevant content if messages are available
  if (lines.length >= 250 && !disableTruncation) {
    return await getRelevantFileContent(filePath, numberedContent, messages);
  } else {
    return numberedContent;
  }
};

export { readFileHandler };
