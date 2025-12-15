import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini with the server-side key
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export default async function handler(req, res) {
    // CORS handling
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!ai) {
        return res.status(500).json({ error: 'Server configuration error: GEMINI_API_KEY is missing' });
    }

    const { action, payload } = req.body;

    try {
        let result;

        switch (action) {
            case 'translate':
                result = await handleTranslate(payload);
                break;
            case 'generateDescription':
                result = await handleGenerateDescription(payload);
                break;
            case 'analyzeImage':
                result = await handleAnalyzeImage(payload);
                break;
            case 'extractMenu':
                result = await handleExtractMenu(payload);
                break;
            case 'transformImage':
                result = await handleTransformImage(payload);
                break;
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error(`AI Error (${action}):`, error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

async function handleTranslate({ text, targetLang }) {
    const prompt = `Translate the following menu text to ${targetLang === 'en' ? 'English' : 'Thai'}. Keep it concise and appetizing. Text: "${text}"`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return { text: response.text.trim() };
}

async function handleGenerateDescription({ dishName, language }) {
    const prompt = `Write a short, appetizing description (max 20 words) for a dish named "${dishName}" in ${language === 'en' ? 'English' : 'Thai'}.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return { text: response.text.trim() };
}

async function handleAnalyzeImage({ base64Image }) {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Image
                    }
                },
                {
                    text: "Analyze this food image. Provide JSON output with 'brightness', 'contrast', and 'saturation' values (numbers between 0.8 and 1.5) to make it look like a gorgeous studio shot (style: nano banana 1). Output ONLY valid JSON."
                }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    brightness: { type: Type.NUMBER },
                    contrast: { type: Type.NUMBER },
                    saturation: { type: Type.NUMBER }
                }
            }
        }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
}

async function handleExtractMenu({ base64Images }) {
    const imageParts = base64Images.map(img => ({
        inlineData: {
            mimeType: 'image/jpeg',
            data: img
        }
    }));

    const promptText = `
    Analyze these menu images. Extract all menu items and group them by their category (e.g., Appetizers, Main Course, Drinks).
    For each item, extract the price.
    Translate the name and description to both English and Thai.
    If a description is missing, generate a short one based on the dish name.
    Return a JSON array of categories.
  `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                ...imageParts,
                { text: promptText }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        category_name_en: { type: Type.STRING },
                        category_name_th: { type: Type.STRING },
                        items: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name_en: { type: Type.STRING },
                                    name_th: { type: Type.STRING },
                                    description_en: { type: Type.STRING },
                                    description_th: { type: Type.STRING },
                                    price: { type: Type.NUMBER }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
}

async function handleTransformImage({ base64Image, userPrompt }) {
    // 1. Analyze the original image to describe it
    const analyzePrompt = "Describe this food dish in detail. Focus on the main ingredients, plating, and colors. Keep it under 50 words.";
    const analysisResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Image
                    }
                },
                { text: analyzePrompt }
            ]
        }
    });

    const description = analysisResponse.text.trim();

    // 2. Generate new image using the description + style
    // If user provided a specific prompt override, use that, otherwise build one.
    const finalPrompt = userPrompt || `Professional food photography of ${description}. High resolution, gorgeous studio shot, soft lighting, 8k, appetizing, style: nano banana 1`;

    // Note: Using 'imagen-4.0-generate-001' model for generation 
    const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: finalPrompt,
        config: {
            numberOfImages: 1,
            aspectRatio: "1:1" // Or "4:3" etc.
        }
    });

    console.log("Raw Image Response:", JSON.stringify(imageResponse, null, 2));

    const generatedImages = imageResponse.generatedImages;
    if (!generatedImages || generatedImages.length === 0) {
        throw new Error("No images returned from API");
    }

    // Extract the image from response (Base64 is in 'image.base64' or similar structure, checking logs)
    // Based on logs: "generatedImages": [ { "image": { "imageBytes": "..." } } ]
    // @ts-ignore
    const generatedImage = generatedImages[0].image.imageBytes;

    return {
        image: generatedImage,
        prompt: finalPrompt,
        originalDescription: description
    };
}
