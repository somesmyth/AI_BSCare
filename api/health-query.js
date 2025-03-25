import { OpenAI } from 'openai';

export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Parse the request body
    const body = await request.json();
    const { query, history } = body || {};

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Define system prompt
    const systemPrompt = `
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

    // Create messages array
    const messages = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      messages.push(...history);
    }

    // Add the current query
    messages.push({ role: "user", content: query });
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages,
      temperature: 0.7,
      max_tokens: 500
    });

    // Inside your try block, add this logging
    console.log('API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
    console.log('API Key first 4 chars:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 4) : 'none');

    // Return the response
    return new Response(
      JSON.stringify({
        response: response.choices[0].message.content
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your request',
        message: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 