import { MessageParam } from "@anthropic-ai/sdk/resources";
import fs from "fs";
import { getRelevantFileContent } from "../../helpers/getRelevantFileContent";
import path from "path";

interface ReadFileParams {
  filePath: string;
  disableTruncation: boolean;
}

const readFileHandler = async (
  { filePath, disableTruncation = true }: ReadFileParams,
  messages: MessageParam[]
): Promise<string> => {
  const fullFilePath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullFilePath)) {
    return "File path does not exist. Try again with corrected file path.";
  }

  const content = fs.readFileSync(fullFilePath, "utf8");

  // Use AI to get relevant content if messages are available
  if (content.split("\n").length >= 250 && !disableTruncation) {
    return await getRelevantFileContent(filePath, content, messages);
  } else {
    return content;
  }
};

export { readFileHandler };
