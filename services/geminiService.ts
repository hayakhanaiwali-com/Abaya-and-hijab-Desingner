import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HijabStyle } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for the text response
const styleSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      styleName: { type: Type.STRING, description: "Creative name of the hijab style" },
      description: { type: Type.STRING, description: "A brief, elegant description of the look" },
      fabric: { type: Type.STRING, description: "Recommended fabric types (e.g., Chiffon, Jersey)" },
      faceShape: { type: Type.STRING, description: "Best suitable face shape (e.g., Round, Oval)" },
      occasion: { type: Type.STRING, description: "Suitable occasion (e.g., College, Wedding)" },
      steps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Step-by-step instructions to tie the hijab",
      },
      colorPalette: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3-4 matching color names",
      },
      imagePrompt: { type: Type.STRING, description: "A highly detailed visual description of a woman wearing this hijab style for an image generator. Include details about lighting, pose, and fabric texture." },
    },
    required: ["styleName", "description", "fabric", "faceShape", "occasion", "steps", "colorPalette", "imagePrompt"],
  },
};

export const generateHijabStyles = async (userPreference: string): Promise<HijabStyle[]> => {
  try {
    const prompt = `Suggest 3 stylish and modest hijab styling ideas based on the following preference: "${userPreference}". 
    The styles should be practical, elegant, and culturally respectful. Provide specific details about fabric and tying method.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: styleSchema,
        systemInstruction: "You are a world-class modest fashion stylist. Your tone is encouraging, elegant, and practical.",
      },
    });

    if (response.text) {
      const parsedData = JSON.parse(response.text);
      // Add IDs for React keys
      return parsedData.map((style: any, index: number) => ({
        ...style,
        id: `style-${Date.now()}-${index}`,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error generating styles:", error);
    throw error;
  }
};

export const generateStyleImage = async (imagePrompt: string): Promise<string | null> => {
  try {
    // Using gemini-2.5-flash-image for generation as per prompt instructions
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Or appropriate image model
      contents: {
        parts: [
          {
            text: `High fashion photography, modest fashion, professional portrait. ${imagePrompt}. Soft lighting, 8k resolution, elegant aesthetics.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         return `data:image/png;base64,${part.inlineData.data}`;
       }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null; // Fail gracefully for images
  }
};
