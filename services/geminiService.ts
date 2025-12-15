import { GoogleGenAI, Type } from "@google/genai";
import { ImageEnhancement } from "../types";

// --- CLIENT SIDE CONFIG (DEV ONLY) ---
// In development, we use the client-side key to avoid needing 'vercel dev'
const devApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const devAi = devApiKey ? new GoogleGenAI({ apiKey: devApiKey }) : null;

// --- SERVER SIDE CONFIG (PROD) ---
// In production, we call the /api/ai endpoint which uses the secure server-side key


// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Unified function to handle both Dev (Client) and Prod (Server) logic
const executeAiRequest = async (action: string, payload: any): Promise<any> => {

  // 1. DEVELOPMENT MODE: Use Client-Side SDK directly
  if (import.meta.env.DEV) {
    if (!devAi) {
      console.error("Gemini API Key missing for local development. Check .env.local");
      throw new Error("Missing API Key");
    }
    console.log(`[Dev Mode] Executing AI request: ${action} locally`);

    switch (action) {
      case 'translate':
        return await devTranslate(payload);
      case 'generateDescription':
        return await devGenerateDescription(payload);
      case 'analyzeImage':
        return await devAnalyzeImage(payload);
      case 'extractMenu':
        return await devExtractMenu(payload);
      default:
        throw new Error("Invalid Action");
    }
  }

  // 2. PRODUCTION MODE: Call the Secure Backend API
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`AI Service Error (${action}):`, error);
    throw error;
  }
};

// --- Client-Side Implementations (Mirroring backend logic) ---

async function devTranslate({ text, targetLang }: any) {
  if (!devAi) throw new Error("No AI");
  const prompt = `Translate the following menu text to ${targetLang === 'en' ? 'English' : 'Thai'}. Keep it concise and appetizing. Text: "${text}"`;
  const response = await devAi.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  return { text: response.text.trim() };
}

async function devGenerateDescription({ dishName, language }: any) {
  if (!devAi) throw new Error("No AI");
  const prompt = `Write a short, appetizing description (max 20 words) for a dish named "${dishName}" in ${language === 'en' ? 'English' : 'Thai'}.`;
  const response = await devAi.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  return { text: response.text.trim() };
}

async function devAnalyzeImage({ base64Image }: any) {
  if (!devAi) throw new Error("No AI");
  const response = await devAi.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Analyze this food image. Provide JSON output with 'brightness', 'contrast', and 'saturation' values (numbers between 0.8 and 1.5) to make it look like a gorgeous studio shot (style: nano banana 1). Output ONLY valid JSON." }
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

async function devExtractMenu({ base64Images }: any) {
  if (!devAi) throw new Error("No AI");
  const imageParts = base64Images.map((img: string) => ({
    inlineData: { mimeType: 'image/jpeg', data: img }
  }));
  const promptText = `
      Analyze these menu images. Extract all menu items and group them by their category (e.g., Appetizers, Main Course, Drinks).
      For each item, extract the price.
      Translate the name and description to both English and Thai.
      If a description is missing, generate a short one based on the dish name.
      Return a JSON array of categories.
    `;
  const response = await devAi.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [...imageParts, { text: promptText }] },
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


// --- Exported Functions ---

export const translateContent = async (text: string, targetLang: 'en' | 'th'): Promise<string> => {
  try {
    const result = await executeAiRequest('translate', { text, targetLang });
    return result.text;
  } catch (error) {
    return text;
  }
};

export const generateDescription = async (dishName: string, language: 'en' | 'th'): Promise<string> => {
  try {
    const result = await executeAiRequest('generateDescription', { dishName, language });
    return result.text;
  } catch (error) {
    return "";
  }
}

export const analyzeImageForEnhancement = async (base64Image: string): Promise<ImageEnhancement> => {
  try {
    const result = await executeAiRequest('analyzeImage', { base64Image });
    return result as ImageEnhancement;
  } catch (error) {
    return { brightness: 1.1, contrast: 1.1, saturation: 1.2 };
  }
};

export interface ExtractedMenuItem {
  name_en: string;
  name_th: string;
  description_en: string;
  description_th: string;
  price: number;
}

export interface ExtractedCategory {
  category_name_en: string;
  category_name_th: string;
  items: ExtractedMenuItem[];
}

export const extractMenuFromImages = async (base64Images: string[]): Promise<ExtractedCategory[]> => {
  try {
    const result = await executeAiRequest('extractMenu', { base64Images });
    return result as ExtractedCategory[];
  } catch (error) {
    return [];
  }
};
