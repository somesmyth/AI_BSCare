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
    
    // GREETINGS AND CONVERSATION STARTERS
    if (lowerQuery.match(/^(hi|hello|hey|greetings|howdy|hola|good morning|good afternoon|good evening)/)) {
      response = "Hello! I'm BSCare, your health assistant. How can I help you with your health questions today?";
    }
    else if (lowerQuery.match(/^(help|can you help|assist|support|aid me)/)) {
      response = "I'd be happy to help! I can provide information about nutrition, exercise, sleep, stress management, and general wellness topics. What specific health topic would you like to learn more about?";
    }
    else if (lowerQuery.includes("who are you") || lowerQuery.includes("what are you") || lowerQuery.includes("about you")) {
      response = "I'm BSCare, a health information assistant designed to provide general health and wellness information. I can answer questions about nutrition, exercise, sleep, stress management, and other health topics. Remember that I provide general information, not personalized medical advice.";
    }
    else if (lowerQuery.match(/^(thanks|thank you|thx|ty|appreciate)/)) {
      response = "You're welcome! If you have any other health questions, feel free to ask. I'm here to help.";
    }
    else if (lowerQuery.includes("how are you") || lowerQuery.includes("how do you feel")) {
      response = "I'm functioning well and ready to help with your health questions! How can I assist you today?";
    }
    
    // NUTRITION AND DIET
    else if (lowerQuery.includes("healthy diet") || lowerQuery.includes("eat healthy") || lowerQuery.includes("nutrition") || lowerQuery.includes("food")) {
      response = "A healthy diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's important to limit processed foods, added sugars, and excessive salt. The Mediterranean and DASH diets are often recommended by health professionals. Remember, this is general information and not medical advice. For personalized dietary recommendations, please consult with a healthcare professional or registered dietitian.";
    }
    else if (lowerQuery.includes("mediterranean diet")) {
      response = "The Mediterranean diet emphasizes plant-based foods like fruits, vegetables, whole grains, legumes, and nuts. It includes moderate amounts of fish, poultry, and dairy, while limiting red meat. Olive oil is the primary fat source. This eating pattern is associated with reduced risk of heart disease, certain cancers, and cognitive decline. As with any diet, it's best to consult with a healthcare provider before making significant changes.";
    }
    else if (lowerQuery.includes("dash diet")) {
      response = "The DASH (Dietary Approaches to Stop Hypertension) diet is designed to help lower blood pressure. It emphasizes fruits, vegetables, whole grains, lean proteins, and low-fat dairy while limiting sodium, red meat, and sweets. Research shows it can lower blood pressure in as little as two weeks. This diet is also beneficial for overall heart health and weight management. Consult with a healthcare provider before starting any new diet plan.";
    }
    else if (lowerQuery.includes("vegetarian") || lowerQuery.includes("vegan")) {
      response = "Vegetarian and vegan diets can be very healthy when well-planned. They typically include plenty of fruits, vegetables, whole grains, legumes, nuts, and seeds. Vegans avoid all animal products, while vegetarians may include eggs, dairy, or both. These diets may reduce the risk of heart disease, high blood pressure, type 2 diabetes, and certain cancers. It's important to ensure adequate intake of protein, vitamin B12, iron, zinc, calcium, and omega-3 fatty acids. Consider consulting with a registered dietitian for personalized guidance.";
    }
    else if (lowerQuery.includes("protein") || lowerQuery.includes("protein sources")) {
      response = "Good protein sources include lean meats, poultry, fish, eggs, dairy products, legumes (beans, lentils, chickpeas), tofu, tempeh, edamame, nuts, and seeds. Plant proteins can be combined to provide all essential amino acids. The recommended daily protein intake for most adults is 0.8 grams per kilogram of body weight, though needs may be higher for athletes, older adults, and during pregnancy. Spreading protein intake throughout the day may be beneficial for muscle maintenance and growth.";
    }
    
    // EXERCISE AND FITNESS
    else if (lowerQuery.includes("exercise") || lowerQuery.includes("workout") || lowerQuery.includes("fitness") || lowerQuery.includes("active")) {
      response = "Regular physical activity is essential for good health. Adults should aim for at least 150 minutes of moderate-intensity exercise or 75 minutes of vigorous activity per week, along with muscle-strengthening activities twice a week. Find activities you enjoy, as you're more likely to stick with them. Start slowly if you're new to exercise and gradually increase intensity and duration. Always consult with a healthcare provider before starting a new exercise program, especially if you have any health concerns or conditions.";
    }
    else if (lowerQuery.includes("cardio") || lowerQuery.includes("aerobic") || lowerQuery.includes("cardiovascular")) {
      response = "Cardiovascular (aerobic) exercise strengthens your heart and lungs, improves circulation, and helps manage weight and stress. Examples include walking, jogging, swimming, cycling, dancing, and using cardio machines. Aim for at least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity cardio per week. You can break this into smaller sessions of at least 10 minutes. Start with what you can manage and gradually increase duration and intensity. Remember to warm up before and cool down after your workout.";
    }
    else if (lowerQuery.includes("strength training") || lowerQuery.includes("weights") || lowerQuery.includes("resistance training")) {
      response = "Strength training helps build and maintain muscle mass, strengthen bones, improve posture, boost metabolism, and enhance daily functioning. Include exercises for all major muscle groups (legs, hips, back, chest, abdomen, shoulders, arms) at least twice weekly. You can use free weights, machines, resistance bands, or body weight exercises. Start with lighter weights and proper form, then gradually increase resistance. Allow 48 hours of recovery between working the same muscle groups. If you're new to strength training, consider working with a qualified fitness professional to learn proper technique.";
    }
    
    // SLEEP
    else if (lowerQuery.includes("sleep") || lowerQuery.includes("insomnia") || lowerQuery.includes("tired") || lowerQuery.includes("rest")) {
      response = "Quality sleep is essential for physical and mental health. Most adults need 7-9 hours nightly. To improve sleep: maintain a consistent sleep schedule; create a restful environment (dark, quiet, cool); establish a relaxing bedtime routine; limit screen time before bed; avoid caffeine, alcohol, and large meals close to bedtime; get regular physical activity (but not too close to bedtime); and manage stress. If you have persistent sleep problems despite these measures, consider consulting a healthcare provider, as sleep disorders require proper diagnosis and treatment.";
    }
    else if (lowerQuery.includes("insomnia") || lowerQuery.includes("can't sleep") || lowerQuery.includes("trouble sleeping")) {
      response = "Insomnia—difficulty falling or staying asleep—can have many causes, including stress, anxiety, depression, medical conditions, medications, or poor sleep habits. Short-term strategies include practicing good sleep hygiene, relaxation techniques, and cognitive behavioral techniques for sleep. Avoid watching the clock, which increases anxiety. If you can't fall asleep within 20 minutes, get up and do something relaxing until you feel sleepy. For persistent insomnia (lasting over a month), consult a healthcare provider, as professional treatment may be needed.";
    }
    
    // MENTAL HEALTH
    else if (lowerQuery.includes("mental health") || lowerQuery.includes("depression") || lowerQuery.includes("anxiety") || lowerQuery.includes("mood") || lowerQuery.includes("therapy")) {
      response = "Mental health is as important as physical health. Taking care of your mental wellbeing includes getting regular exercise, adequate sleep, maintaining social connections, practicing stress management, and seeking professional help when needed. Common mental health conditions like anxiety and depression are treatable. Therapy, medication, lifestyle changes, or a combination of these can be effective. If you're experiencing persistent feelings of sadness, anxiety, or other mental health concerns, please reach out to a mental health professional for proper evaluation and support.";
    }
    else if (lowerQuery.includes("stress") || lowerQuery.includes("stress management") || lowerQuery.includes("relax") || lowerQuery.includes("relaxation")) {
      response = "Managing stress is crucial for both mental and physical health. Effective stress management techniques include: regular physical activity; relaxation practices like deep breathing, meditation, or yoga; maintaining social connections; getting adequate sleep; time management; setting boundaries; engaging in enjoyable activities; and practicing mindfulness. Different strategies work for different people, so experiment to find what works best for you. If stress is significantly affecting your daily functioning or health, consider speaking with a mental health professional for additional support.";
    }
    else if (lowerQuery.includes("meditation") || lowerQuery.includes("mindfulness")) {
      response = "Meditation and mindfulness practices can reduce stress, anxiety, and depression while improving focus, emotional regulation, and overall wellbeing. Mindfulness involves paying attention to the present moment without judgment. To start: find a quiet space; sit comfortably; focus on your breath or a simple mantra; when your mind wanders (which is normal), gently return your attention to your focus point. Begin with just 5 minutes daily and gradually increase. Many apps and online resources offer guided meditations. Consistency is more important than duration—even brief daily practice can provide benefits.";
    }
    
    // SPECIFIC HEALTH CONDITIONS
    else if (lowerQuery.includes("diabetes") || lowerQuery.includes("blood sugar")) {
      response = "Diabetes is a chronic condition affecting how your body processes blood sugar (glucose). Management typically involves monitoring blood glucose, medication or insulin as prescribed, regular physical activity, and a balanced diet with carbohydrate awareness. Regular medical check-ups are essential to monitor and prevent complications. Each person's diabetes management plan should be individualized—work closely with your healthcare team to develop and adjust your plan as needed. If you're concerned about diabetes, consult with a healthcare provider for proper diagnosis and treatment guidance.";
    }
    else if (lowerQuery.includes("heart disease") || lowerQuery.includes("cardiovascular disease")) {
      response = "Heart disease encompasses various conditions affecting heart function. Prevention and management strategies include: maintaining a heart-healthy diet (low in saturated fats, trans fats, and sodium, rich in fruits, vegetables, and whole grains); regular physical activity; not smoking; limiting alcohol; managing stress; and controlling conditions like high blood pressure, high cholesterol, and diabetes. If you have heart disease, follow your treatment plan carefully and attend regular check-ups. Know the warning signs of heart attack and stroke, and seek immediate medical attention if they occur.";
    }
    else if (lowerQuery.includes("high blood pressure") || lowerQuery.includes("hypertension")) {
      response = "High blood pressure (hypertension) often has no symptoms but can lead to serious health problems if untreated. Management typically includes: regular monitoring; medication if prescribed; reducing sodium intake; following a balanced diet rich in fruits, vegetables, and low-fat dairy (like the DASH diet); regular physical activity; maintaining a healthy weight; limiting alcohol; not smoking; and managing stress. If you have high blood pressure, work closely with your healthcare provider to develop and adjust your treatment plan as needed.";
    }
    
    // PAIN MANAGEMENT
    else if (lowerQuery.includes("pain management") || lowerQuery.includes("chronic pain")) {
      response = "Chronic pain management typically involves a multifaceted approach. This may include: appropriate physical activity; physical therapy; pain medications used as directed; hot or cold therapy; stress management techniques; cognitive behavioral therapy; complementary approaches like acupuncture or massage; and proper sleep hygiene. The goal is to improve function and quality of life, even if pain cannot be completely eliminated. Work with healthcare providers to develop a comprehensive pain management plan tailored to your specific condition and needs.";
    }
    else if (lowerQuery.includes("back pain") || lowerQuery.includes("backache") || lowerQuery.includes("backpain")) {
      response = "Back pain management depends on the cause and severity. For most acute back pain, self-care measures include: brief rest followed by gentle movement; over-the-counter pain relievers if appropriate; hot or cold therapy; and gradual return to normal activities. Prevention strategies include maintaining good posture, using proper lifting techniques, strengthening core muscles, staying physically active, and maintaining a healthy weight. If back pain is severe, worsening, or accompanied by other symptoms like numbness or weakness, consult with a healthcare provider for proper evaluation and treatment.";
    }
    else if (lowerQuery.includes("headache") || lowerQuery.includes("migraine")) {
      response = "Headache management depends on the type and cause. For tension headaches, strategies may include stress management, adequate sleep, regular physical activity, and over-the-counter pain relievers if appropriate. For migraines, identifying and avoiding triggers is important, along with prescribed medications if needed. Keep a headache diary to track patterns and triggers. If you experience severe, sudden, or unusual headaches, headaches with fever or stiff neck, or headaches following head injury, seek immediate medical attention. For recurrent headaches, consult with a healthcare provider for proper diagnosis and treatment.";
    }
    
    // PREVENTIVE CARE
    else if (lowerQuery.includes("preventive care") || lowerQuery.includes("prevention") || lowerQuery.includes("check up") || lowerQuery.includes("checkup")) {
      response = "Preventive care helps identify and address health issues before they become serious. Key components include: regular check-ups with your healthcare provider; age-appropriate screenings (blood pressure, cholesterol, cancer screenings, etc.); immunizations; dental check-ups; vision exams; and lifestyle practices like healthy eating, regular physical activity, adequate sleep, stress management, and avoiding tobacco and excessive alcohol. Recommended screenings and their frequency vary based on age, sex, family history, and risk factors. Discuss with your healthcare provider which preventive services are appropriate for you.";
    }
    
    // WEIGHT MANAGEMENT
    else if (lowerQuery.includes("weight") || lowerQuery.includes("lose weight") || lowerQuery.includes("obesity") || lowerQuery.includes("overweight") || lowerQuery.includes("fat")) {
      response = "Healthy weight management involves a balanced approach to diet and physical activity. Focus on nutritious foods, portion control, regular exercise, and behavior changes rather than extreme diets. A sustainable weight loss goal is typically 0.5-1 kg (1-2 pounds) per week. Remember that health is not just about weight—improvements in fitness, energy, sleep, and mood are important outcomes too. If you're struggling with weight management, consider consulting with healthcare providers like a physician, registered dietitian, or behavioral health specialist for personalized guidance.";
    }
    
    // HYDRATION
    else if (lowerQuery.includes("hydration") || lowerQuery.includes("water") || lowerQuery.includes("drink") || lowerQuery.includes("thirsty")) {
      response = "Staying hydrated is essential for overall health. Water regulates body temperature, lubricates joints, delivers nutrients to cells, and helps maintain organ function. Most adults need about 8-10 cups (64-80 ounces) of fluid daily, though needs vary based on activity level, climate, health status, and body size. Water is the best choice, but other beverages, fruits, and vegetables also contribute to fluid intake. Your urine should be pale yellow to clear if you're well-hydrated. Remember to drink more during exercise, hot weather, or illness.";
    }
    
    // PROBLEM STATEMENTS
    else if (lowerQuery.includes("problem") || lowerQuery.includes("issue") || lowerQuery.includes("concern")) {
      response = "I understand you have a health concern. While I can provide general health information, I can't diagnose specific conditions or provide personalized medical advice. For any specific health problems, it's important to consult with a qualified healthcare professional who can provide proper evaluation and treatment recommendations.";
    }
    
    // DEFAULT RESPONSE
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