import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

// Manual env parsing to avoid dotenv dependency issues if not installed or types missing
const envPath = path.resolve('.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env.local");
}

if (!apiKey) {
    console.error("No API Key found in .env.local");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        console.log("Fetching models...");
        const response = await ai.models.list();

        console.log("\n--- Available Models ---");
        // Iterate over Pager
        for await (const model of response) {
            console.log(`- ${model.name} (Methods: ${model.supportedGenerationMethods?.join(', ') || 'unknown'})`);
        }
    } catch (e) {
        console.error("Error listing models:", e);
    }
}

listModels();
