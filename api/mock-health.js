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

    // Convert query to lowercase for easier matching
    const lowerQuery = query.toLowerCase();
    
    // Generate a response based on the query
    let response = "";
    
    // Greeting patterns
    if (lowerQuery.match(/^(hi|hello|hey|greetings|howdy)/)) {
      response = "Hello! I'm BSCare, your health assistant. How can I help you with your health questions today?";
    }
    // Help requests
    else if (lowerQuery.match(/^(help|can you help|assist|support)/)) {
      response = "I'd be happy to help! I can provide information about nutrition, exercise, sleep, stress management, and general wellness topics. What specific health topic would you like to learn more about?";
    }
    // Introduction questions
    else if (lowerQuery.includes("who are you") || lowerQuery.includes("what are you") || lowerQuery.includes("about you")) {
      response = "I'm BSCare, a health information assistant designed to provide general health and wellness information. I can answer questions about nutrition, exercise, sleep, stress management, and other health topics. Remember that I provide general information, not personalized medical advice.";
    }
    // Thank you responses
    else if (lowerQuery.match(/^(thanks|thank you|thx)/)) {
      response = "You're welcome! If you have any other health questions, feel free to ask. I'm here to help.";
    }
    // Diet and nutrition
    else if (lowerQuery.includes("healthy diet") || lowerQuery.includes("eat healthy") || lowerQuery.includes("nutrition") || lowerQuery.includes("food")) {
      response = "A healthy diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's important to limit processed foods, added sugars, and excessive salt. Remember, this is general information and not medical advice. For personalized dietary recommendations, please consult with a healthcare professional or registered dietitian.";
    } 
    // Exercise and fitness
    else if (lowerQuery.includes("exercise") || lowerQuery.includes("workout") || lowerQuery.includes("fitness") || lowerQuery.includes("active")) {
      response = "Regular physical activity is essential for good health. Adults should aim for at least 150 minutes of moderate-intensity exercise or 75 minutes of vigorous activity per week, along with muscle-strengthening activities twice a week. Always consult with a healthcare provider before starting a new exercise program, especially if you have any health concerns or conditions.";
    } 
    // Sleep
    else if (lowerQuery.includes("sleep") || lowerQuery.includes("insomnia") || lowerQuery.includes("tired") || lowerQuery.includes("rest")) {
      response = "Good sleep is crucial for overall health. Adults typically need 7-9 hours of quality sleep per night. To improve sleep, maintain a regular sleep schedule, create a restful environment, limit screen time before bed, avoid caffeine and alcohol close to bedtime, and stay physically active during the day. If you have persistent sleep problems, consider consulting a healthcare provider.";
    } 
    // Stress management
    else if (lowerQuery.includes("stress") || lowerQuery.includes("anxiety") || lowerQuery.includes("relax") || lowerQuery.includes("worry")) {
      response = "Managing stress is important for both mental and physical health. Effective stress management techniques include regular exercise, meditation, deep breathing exercises, maintaining social connections, getting enough sleep, and practicing mindfulness. If stress is significantly affecting your daily life, consider speaking with a mental health professional.";
    } 
    // Hydration
    else if (lowerQuery.includes("water") || lowerQuery.includes("hydration") || lowerQuery.includes("drink") || lowerQuery.includes("thirsty")) {
      response = "Staying hydrated is essential for good health. The general recommendation is to drink about 8 cups (64 ounces) of water per day, but individual needs vary based on factors like activity level, climate, and overall health. Your urine should be pale yellow to clear if you're well-hydrated. Remember that fruits, vegetables, and other beverages also contribute to your fluid intake.";
    } 
    // Weight management
    else if (lowerQuery.includes("weight") || lowerQuery.includes("lose weight") || lowerQuery.includes("obesity") || lowerQuery.includes("fat")) {
      response = "Healthy weight management involves a balanced approach to diet and physical activity. Focus on nutritious foods, portion control, regular exercise, and behavior changes rather than extreme diets. A sustainable weight loss goal is typically 1-2 pounds per week. Remember that health is not just about weight, and it's important to consult with healthcare providers for personalized advice.";
    }
    // Mental health
    else if (lowerQuery.includes("mental health") || lowerQuery.includes("depression") || lowerQuery.includes("mood") || lowerQuery.includes("therapy")) {
      response = "Mental health is just as important as physical health. Taking care of your mental wellbeing includes getting regular exercise, adequate sleep, maintaining social connections, practicing stress management, and seeking professional help when needed. If you're experiencing persistent feelings of sadness, anxiety, or other mental health concerns, please reach out to a mental health professional.";
    }
    // Heart health
    else if (lowerQuery.includes("heart") || lowerQuery.includes("cardiovascular") || lowerQuery.includes("blood pressure") || lowerQuery.includes("cholesterol")) {
      response = "Heart health is influenced by many factors including diet, exercise, stress levels, and genetics. To support heart health, aim for regular physical activity, a diet rich in fruits, vegetables, whole grains, and healthy fats, maintain a healthy weight, don't smoke, limit alcohol, and manage stress. Regular check-ups with your healthcare provider are important for monitoring blood pressure, cholesterol, and other heart health indicators.";
    }
    // Problem statements
    else if (lowerQuery.includes("problem") || lowerQuery.includes("issue") || lowerQuery.includes("concern")) {
      response = "I understand you have a health concern. While I can provide general health information, I can't diagnose specific conditions or provide personalized medical advice. For any specific health problems, it's important to consult with a qualified healthcare professional who can provide proper evaluation and treatment recommendations.";
    }
    // Default response
    else {
      response = "Thank you for your health question. As a general health assistant, I can provide information on various health topics including nutrition, exercise, sleep, and preventive care. However, I'm not able to diagnose conditions or provide personalized medical advice. For specific health concerns, please consult with a qualified healthcare professional.";
    }

    // Return the response
    return new Response(
      JSON.stringify({
        response: response
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