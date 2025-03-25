// Simple API to test if Vercel Functions are working
module.exports = (req, res) => {
  res.status(200).json({
    message: 'API is working!',
    env: process.env.NODE_ENV,
    hasApiKey: !!process.env.OPENAI_API_KEY
  });
}; 