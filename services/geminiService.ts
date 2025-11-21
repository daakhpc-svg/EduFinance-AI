import { GoogleGenAI } from "@google/genai";
import { Student, PaymentRecord } from '../types';

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      console.warn("API Key is missing. AI features will not work.");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const generateAIResponse = async (
  prompt: string,
  contextData: { students: Student[], payments: PaymentRecord[] }
): Promise<string> => {
  const ai = getClient();
  
  // Prepare context for the model
  // We stringify the data to give the model context about the current state of the system
  // NOTE: In a production app, handle PII carefully. This is a demo.
  const dataContext = `
    Current System Data:
    Students Summary: ${JSON.stringify(contextData.students.map(s => ({
      name: `${s.firstName} ${s.lastName}`,
      grade: s.grade,
      status: s.status,
      owed: s.totalFees - s.paidFees
    })))}
    
    Recent Payments Summary: ${JSON.stringify(contextData.payments.slice(0, 5))}
  `;

  const systemInstruction = `
    You are an intelligent assistant for a School Fee Management System named 'EduFinance AI'.
    Your role is to help administrators analyze financial data, draft reminders to parents, and answer questions about fee status.
    
    Rules:
    1. Be professional, concise, and helpful.
    2. If asked to draft an email, use placeholders like [Parent Name] if specific names aren't provided, but use provided data if available.
    3. Use the provided context data to answer specific questions about who owes money, who has paid, etc.
    4. Format financial figures with currency symbols (e.g., $).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: ${dataContext}\n\nUser Query: ${prompt}`,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error while processing your request. Please check your API key configuration.";
  }
};