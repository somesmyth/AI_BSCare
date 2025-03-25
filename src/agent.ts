import { OpenAI } from 'openai';

export class BSCareAgent {
  private openai: OpenAI;
  private systemPrompt: string;

  constructor() {
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    // Define the system prompt for health-related responses
    this.systemPrompt = `
      You are BSCare, a helpful health assistant. Your role is to provide general health information, 
      wellness tips, and guidance on common health concerns. 
      
      Important guidelines:
      1. Always clarify that you're providing general information, not medical advice.
      2. For serious health concerns, recommend consulting with a healthcare professional.
      3. Base your responses on established medical knowledge and research.
      4. Be empathetic and supportive in your responses.
      5. If you don't know something, be honest about your limitations.
      6. Never diagnose conditions or prescribe treatments.
      7. Focus on evidence-based information and avoid controversial claims.
      8. Provide information on healthy lifestyle choices, preventive care, and general wellness.
      
      Remember: Your goal is to educate and inform, not replace professional medical care.
    `;
  }

  async processQuery(query: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo", // Use an appropriate model
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: query }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content || "I'm sorry, I couldn't process your query.";
    } catch (error) {
      console.error('Error in BSCare agent:', error);
      return "I'm sorry, I encountered an error while processing your request. Please try again later.";
    }
  }

  // Method to handle follow-up questions with context
  async processFollowUp(query: string, conversationHistory: Array<{role: string, content: string}>): Promise<string> {
    try {
      // Create messages array with system prompt and conversation history
      const messages = [
        { role: "system" as const, content: this.systemPrompt },
        ...conversationHistory,
        { role: "user" as const, content: query }
      ];

      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content || "I'm sorry, I couldn't process your follow-up question.";
    } catch (error) {
      console.error('Error in BSCare agent follow-up:', error);
      return "I'm sorry, I encountered an error while processing your follow-up question. Please try again later.";
    }
  }
} 