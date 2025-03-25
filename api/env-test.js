export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  const envVars = {
    nodeEnv: process.env.NODE_ENV,
    hasApiKey: !!process.env.OPENAI_API_KEY,
    apiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
    apiKeyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 4) : 'none'
  };
  
  return new Response(
    JSON.stringify(envVars),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
} 