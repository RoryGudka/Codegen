import fs from 'fs';
import path from 'path';

const credentialsPath = path.resolve('.codegen', 'credentials.json');

export function readCredentials() {
  if (!fs.existsSync(credentialsPath)) {
    throw new Error('Credentials file not found. Please run the configure command first.');
  }

  const credentialsData = fs.readFileSync(credentialsPath, 'utf8');
  try {
    return JSON.parse(credentialsData);
  } catch (error) {
    throw new Error('Error parsing credentials file. Please ensure it is in JSON format.');
  }
}
