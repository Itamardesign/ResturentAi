import { GoogleGenAI, Type } from "@google/genai";
import { ImageEnhancement } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
console.log("Gemini Service Initialized. API Key present:", !!apiKey);
const ai = new GoogleGenAI({ apiKey });

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const translateContent = async (text: string, targetLang: 'en' | 'th'): Promise<string> => {
  if (!apiKey) return "API Key Missing";

  try {
    const prompt = `Translate the following menu text to ${targetLang === 'en' ? 'English' : 'Thai'}. Keep it concise and appetizing. Text: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original
  }
};

export const generateDescription = async (dishName: string, language: 'en' | 'th'): Promise<string> => {
  if (!apiKey) return "";

  try {
    const prompt = `Write a short, appetizing description (max 20 words) for a dish named "${dishName}" in ${language === 'en' ? 'English' : 'Thai'}.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Description gen error", error);
    return "";
  }
}

export const analyzeImageForEnhancement = async (base64Image: string): Promise<ImageEnhancement> => {
  if (!apiKey) return { brightness: 1, contrast: 1, saturation: 1 };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, though could be png
              data: base64Image
            }
          },
          {
            text: "Analyze this food image. Provide JSON output with 'brightness', 'contrast', and 'saturation' values (numbers between 0.8 and 1.5) to make it look more appetizing (e.g., brighter, more vibrant). Output ONLY valid JSON."
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

    return JSON.parse(text) as ImageEnhancement;
  } catch (error) {
    console.error("Image analysis error:", error);
    return { brightness: 1.1, contrast: 1.1, saturation: 1.2 }; // Fallback "pop" preset
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
  if (!apiKey) return [];

  try {
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
    return JSON.parse(text) as ExtractedCategory[];
  } catch (error) {
    console.error("Menu extraction error:", error);
    return [];
  }
};
