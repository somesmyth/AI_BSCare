export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  return new Response(
    JSON.stringify({
      message: 'Simple API is working!',
      env: process.env.NODE_ENV,
      hasApiKey: !!process.env.OPENAI_API_KEY
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
} 