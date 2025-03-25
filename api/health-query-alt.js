// CommonJS module for Vercel Serverless Functions
const { OpenAI } = require('openai');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, history } = req.body || {};

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Log environment variables
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);

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
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 500
    });

    // Return the response
    return res.status(200).json({
      response: response.choices[0].message.content
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'An error occurred while processing your request',
      message: error.message
    });
  }
}; 