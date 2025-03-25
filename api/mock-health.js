export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
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
    const { query } = body || {};

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate a mock response based on the query
    let mockResponse = "";
    
    if (query.toLowerCase().includes("healthy diet")) {
      mockResponse = "A healthy diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's important to limit processed foods, added sugars, and excessive salt. Remember, this is general information and not medical advice. For personalized dietary recommendations, please consult with a healthcare professional or registered dietitian.";
    } else if (query.toLowerCase().includes("exercise")) {
      mockResponse = "Regular physical activity is essential for good health. Adults should aim for at least 150 minutes of moderate-intensity exercise or 75 minutes of vigorous activity per week, along with muscle-strengthening activities twice a week. Always consult with a healthcare provider before starting a new exercise program, especially if you have any health concerns or conditions.";
    } else {
      mockResponse = "Thank you for your health question. As a general health assistant, I can provide information on various health topics including nutrition, exercise, sleep, and preventive care. However, I'm not able to diagnose conditions or provide personalized medical advice. For specific health concerns, please consult with a qualified healthcare professional.";
    }

    // Return the mock response
    return new Response(
      JSON.stringify({
        response: mockResponse
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