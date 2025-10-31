
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { CaseDetails, GeminiFilePart } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const formatContext = (caseDetails: CaseDetails): string => {
    const details = [
        caseDetails.jurisdiction && `Jurisdiction: ${caseDetails.jurisdiction}`,
        caseDetails.charges && `Charges: ${caseDetails.charges}`,
        caseDetails.sentenceGuidelines && `Sentence Guidelines: ${caseDetails.sentenceGuidelines}`,
        caseDetails.pleaOffer && `Plea Offer: ${caseDetails.pleaOffer}`,
        caseDetails.immigrationStatus && `Immigration Status: ${caseDetails.immigrationStatus}`,
        caseDetails.criminalRecord && `Criminal Record: ${caseDetails.criminalRecord}`,
    ].filter(Boolean); // Filter out empty strings

    if (details.length === 0) return '';

    return `--- Case Context ---\n${details.join('\n')}\n--- End Case Context ---\n\n`;
};

export const generateWithSearch = async (prompt: string, caseDetails: CaseDetails, files: GeminiFilePart[]): Promise<GenerateContentResponse> => {
  const fullPrompt = `${formatContext(caseDetails)}User Query: ${prompt}`;
  const parts: any[] = [{ text: fullPrompt }, ...files];
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts },
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return response;
};

export const generateWithThinking = async (prompt: string, caseDetails: CaseDetails, files: GeminiFilePart[]): Promise<GenerateContentResponse> => {
  const fullPrompt = `${formatContext(caseDetails)}User Query: ${prompt}`;
  const parts: any[] = [{ text: fullPrompt }, ...files];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: { parts },
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
    },
  });
  return response;
};

export const analyzeEvidence = async (evidenceText: string, caseDetails: CaseDetails, files: GeminiFilePart[]): Promise<GenerateContentResponse> => {
    const prompt = `${formatContext(caseDetails)}Analyze the following legal text and/or attached files for key facts, inconsistencies, and potential arguments. Provide a structured summary.

    Evidence Text (if provided):
    ---
    ${evidenceText || "No text provided."}
    ---
    
    Analysis:`;
    
    const parts: any[] = [{ text: prompt }, ...files];
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts },
    });
    return response;
};
