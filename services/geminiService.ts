import { GoogleGenAI } from "@google/genai";
import { Coordinates, SearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findPokemonPlaces = async (
  coords: Coordinates,
  radiusKm: number
): Promise<SearchResult> => {
  try {
    const prompt = `
      Find places related to Pokemon within a ${radiusKm} kilometer radius of the user's location.
      
      Look for:
      1. Hobby shops or Comic book stores that sell Pokemon Cards (TCG).
      2. Gaming centers that host Pokemon tournaments.
      3. Pokemon GO popular community spots or parks known for community days.
      4. Any official Pokemon Center pop-ups or events if available.

      For each place found, provide:
      - The Name
      - A very brief summary of why it's relevant (e.g., "Hosts Friday Night Pokemon").
      
      Be enthusiastic and concise!
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
          },
        },
      },
    });

    const text = response.text || "No specific details found.";
    // Extract grounding chunks if available to provide direct links
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks,
    };
  } catch (error) {
    console.error("Error fetching Pokemon places:", error);
    throw error;
  }
};
