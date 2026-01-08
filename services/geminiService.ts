import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is missing in environment variables");
        return null;
    }
    return new GoogleGenAI({ apiKey });
}

export const analyzeSafetyRisks = async (geneName: string, offTargetGene: string) => {
  const ai = getClient();
  if (!ai) return "AI Service Unavailable (Missing Key)";

  try {
    const prompt = `
      I am designing a CRISPR guide RNA targeting the gene ${geneName}.
      I have identified a potential off-target cut in the gene ${offTargetGene}.
      
      Please provide a brief risk assessment (max 3 sentences) focusing on:
      1. What ${offTargetGene} does.
      2. The potential consequence of an indel mutation in ${offTargetGene}.
      3. A risk level (Low/Medium/High).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
          thinkingConfig: { thinkingBudget: 0 } // Fast response needed
      }
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with AI service.";
  }
};

export const suggestOptimizations = async (sequence: string) => {
    const ai = getClient();
    if (!ai) return null;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze this CRISPR sgRNA sequence: ${sequence}. 
            Check for:
            1. GC content (optimal is 40-60%)
            2. Poly-T runs (terminates transcription)
            3. Self-complementarity
            
            Return a JSON object with 'score' (0-100), 'issues' (array of strings), and 'suggestion' (string).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER },
                        issues: { type: Type.ARRAY, items: { type: Type.STRING }},
                        suggestion: { type: Type.STRING }
                    }
                }
            }
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return null;
    }
}