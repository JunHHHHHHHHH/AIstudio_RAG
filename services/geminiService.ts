
import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
};

export const generateResponse = async (documentContent: string, userPrompt: string, imageBase64?: string, imageMimeType?: string): Promise<string> => {
  const model = 'gemini-2.5-flash';

  const systemInstruction = `You are an expert assistant. Your task is to answer the user's question based *only* on the content of the document provided below. Do not use any external knowledge or information. If the answer cannot be found within the document, you must state that the information is not available in the provided text.`;

  const fullPrompt = `${systemInstruction}\n\n--- DOCUMENT CONTENT START ---\n\n${documentContent}\n\n--- DOCUMENT CONTENT END ---\n\nUser's Question: ${userPrompt}`;
  
  const parts: any[] = [{ text: fullPrompt }];

  if (imageBase64 && imageMimeType) {
    parts.push(fileToGenerativePart(imageBase64, imageMimeType));
  }
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: { parts: parts },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating response from Gemini API:", error);
    if (error instanceof Error) {
        return `Error from API: ${error.message}`;
    }
    return "An unknown error occurred while contacting the API.";
  }
};
