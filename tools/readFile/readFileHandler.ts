import fs from "fs";
import path from "path";

interface ReadFileParams {
  filePath: string;
}

const readFileHandler = async ({
  filePath,
}: ReadFileParams): Promise<string> => {
  const fullFilePath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullFilePath)) {
    return "File path does not exist. Try again with corrected file path.";
  }

  const content = fs.readFileSync(fullFilePath, "utf8");
  const lines = content.split("\n");

  const numberedContent = lines
    .map((line, index) => `${index + 1}. ${line}`)
    .join("\n");

  return numberedContent;
};

export { readFileHandler };
