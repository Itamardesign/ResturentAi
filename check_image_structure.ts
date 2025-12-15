
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
    if (match) apiKey = match[1].trim();
} catch (e) { }

if (!apiKey) process.exit(1);

const ai = new GoogleGenAI({ apiKey });

async function testStructure() {
    try {
        console.log("Generating...");
        // @ts-ignore
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: "apple",
            config: { numberOfImages: 1, aspectRatio: "1:1" }
        });

        // @ts-ignore
        const imgObj = response.generatedImages[0].image;
        console.log("Image Object Keys:", Object.keys(imgObj));

        // Check if base64 exists or is named differently
        if (imgObj.base64) console.log("Has 'base64' (length: " + imgObj.base64.length + ")");
        if (imgObj.image64) console.log("Has 'image64'");
        if (imgObj.bytes) console.log("Has 'bytes'");

    } catch (e) {
        console.error(e);
    }
}
testStructure();
