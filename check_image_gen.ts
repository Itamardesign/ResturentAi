
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

// Manual env parsing
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

async function testImageGen() {
    try {
        console.log("Testing Imagen 4.0 generation...");
        const prompt = "A delicious plate of pad thai";

        // @ts-ignore
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: "1:1"
            }
        });

        console.log("\n--- Full Response Keys ---");
        console.log(Object.keys(response));

        console.log("\n--- Full Response JSON ---");
        console.log(JSON.stringify(response, null, 2));

    } catch (e) {
        console.error("Error generating image:", e);
    }
}

testImageGen();
