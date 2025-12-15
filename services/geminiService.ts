import { ImageEnhancement } from "../types";

// Helper to convert File to Base64 (Client-side helper)
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

const callApi = async (action: string, payload: any) => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

export const translateContent = async (text: string, targetLang: 'en' | 'th'): Promise<string> => {
  try {
    const result = await callApi('translate', { text, targetLang });
    return result.text;
  } catch (error) {
    return text; // Fallback
  }
};

export const generateDescription = async (dishName: string, language: 'en' | 'th'): Promise<string> => {
  try {
    const result = await callApi('generateDescription', { dishName, language });
    return result.text;
  } catch (error) {
    return "";
  }
}

export const analyzeImageForEnhancement = async (base64Image: string): Promise<ImageEnhancement> => {
  try {
    const result = await callApi('analyzeImage', { base64Image });
    return result as ImageEnhancement;
  } catch (error) {
    return { brightness: 1.1, contrast: 1.1, saturation: 1.2 }; // Fallback
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
    const result = await callApi('extractMenu', { base64Images });
    return result as ExtractedCategory[];
  } catch (error) {
    return [];
  }
};
