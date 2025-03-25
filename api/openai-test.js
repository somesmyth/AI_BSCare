export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  try {
    // Test if we can access the API key
    const apiKey = process.env.OPENAI_API_KEY || 'not-set';
    
    // Return a simple response
    return new Response(
      JSON.stringify({
        message: 'OpenAI test endpoint',
        hasApiKey: !!process.env.OPENAI_API_KEY,
        apiKeyLength: apiKey.length,
        // Simulate a response without actually calling OpenAI
        simulatedResponse: "This is a simulated response to test if the endpoint works without calling OpenAI."
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'An error occurred',
        message: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 