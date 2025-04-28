import fs from "fs";
import path from "path";
import readline from "readline";

export async function configure() {
  // Create an interface to read lines from the console input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const credentialsPath = path.resolve(".codegen", "credentials.json");

  const askQuestion = (question: string): Promise<string> => {
    return new Promise((resolve) => rl.question(question, resolve));
  };

  try {
    // Prompt user for their credentials
    const anthropicApiKey = await askQuestion("Enter your ANTHROPIC_API_KEY: ");
    const tavilyApiKey = await askQuestion("Enter your TAVILY_API_KEY: ");

    // Prepare credentials object
    const credentials = {
      ANTHROPIC_API_KEY: anthropicApiKey.trim(),
      TAVILY_API_KEY: tavilyApiKey.trim(),
    };

    // Ensure directory exists
    fs.mkdirSync(path.dirname(credentialsPath), { recursive: true });

    // Write credentials to the file
    fs.writeFileSync(
      credentialsPath,
      JSON.stringify(credentials, null, 2),
      "utf8"
    );

    console.info("API keys have been stored successfully.");
  } catch (error) {
    console.error("An error occurred while saving credentials:", error);
  } finally {
    // Close the readline interface
    rl.close();
  }
}
