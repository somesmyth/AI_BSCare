const { OpenAI } = require('openai');

// Export a default function for Vercel serverless functions
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
    // Log the request body for debugging
    console.log('Request body:', req.body);
    
    const { query, history } = req.body || {};

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Log environment variables (without revealing the full API key)
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    
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

    console.log('Calling OpenAI API with messages:', messages.length);
    
    // Call OpenAI API with error handling for rate limits
    let response;
    try {
      response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 500
      });
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Check if it's a rate limit error
      if (openaiError.message.includes('rate limit') || openaiError.status === 429) {
        return res.status(429).json({
          error: 'Rate limit exceeded. Please try again later.',
          message: openaiError.message
        });
      }
      
      // Check if it's an authentication error
      if (openaiError.message.includes('authentication') || openaiError.status === 401) {
        return res.status(401).json({
          error: 'Authentication error. Please check your API key.',
          message: openaiError.message
        });
      }
      
      // Re-throw for general handling
      throw openaiError;
    }

    console.log('OpenAI API response received');
    
    // Return the response
    return res.status(200).json({
      response: response.choices[0].message.content
    });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    return res.status(500).json({
      error: 'An error occurred while processing your request',
      message: error.message,
      code: error.code
    });
  }
}; 