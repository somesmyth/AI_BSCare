import express from 'express';
import dotenv from 'dotenv';
import { BSCareAgent } from './agent';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is missing');
  console.error('Please add it to your .env file or set it in your environment');
  process.exit(1);
}

// Initialize the BSCare agent
const bsCareAgent = new BSCareAgent();

// API endpoint for health queries
app.post('/api/health-query', async (req, res) => {
  try {
    const { query, history } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    let response;
    
    // If there's conversation history, use it for context
    if (history && history.length > 0) {
      response = await bsCareAgent.processFollowUp(query, history);
    } else {
      response = await bsCareAgent.processQuery(query);
    }
    
    return res.json({ response });
  } catch (error) {
    console.error('Error processing health query:', error);
    return res.status(500).json({ error: 'Failed to process your health query' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`BSCare health agent is running on port ${port}`);
}); 