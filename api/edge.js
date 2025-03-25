export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  return new Response(
    JSON.stringify({
      message: 'Edge API is working!',
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
} 