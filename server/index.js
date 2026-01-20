require('dotenv').config();
const WebSocket = require('ws');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy',
  baseURL: 'https://openrouter.ai/api/v1',
});

const wss = new WebSocket.Server({ port: 8081 });

console.log('WebSocket server started on port 8081');

// Check API key on startup
const hasValidApiKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-dummy' && process.env.OPENAI_API_KEY.startsWith('sk-');
if (!hasValidApiKey) {
  console.warn('WARNING: Valid OPENAI_API_KEY not set in .env file. Using DEMO MODE with mock responses.');
}

// Demo response generator
function generateDemoResponse(userMessage) {
  const responses = {
    hello: "Hello! I'm a demo AI assistant. Since we're in demo mode, I can't connect to the actual OpenAI API. But I can show you how the chat interface works!",
    hi: "Hey there! Welcome to the Realtime AI Chatbot demo. This is a mock response to demonstrate the interface.",
    how: "I'm doing great, thanks for asking! In demo mode, I generate simple responses to show how the real chatbot would work.",
    test: "This is a test message. In production mode with a valid OpenAI API key, you'd get AI-powered responses.",
    help: "I can help with general conversation in demo mode. Try asking me anything and I'll respond with a demo message.",
    default: "Thanks for your message! This is a demo response. To use real AI responses, please add a valid OpenAI API key to your .env file."
  };

  const userLower = userMessage.toLowerCase();
  for (const [key, response] of Object.entries(responses)) {
    if (userLower.includes(key)) return response;
  }
  return responses.default;
}

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    try {
      const { text } = JSON.parse(message.toString());

      if (!text || text.trim() === '') {
        ws.send(JSON.stringify({ type: 'error', message: 'Message cannot be empty' }));
        return;
      }

      // Demo mode - use mock responses
      if (!hasValidApiKey) {
        console.log('Using demo mode for message:', text);
        const demoResponse = generateDemoResponse(text);
        
        // Stream the demo response character by character for realism
        for (const char of demoResponse) {
          ws.send(JSON.stringify({ type: 'token', value: char }));
          // Small delay between characters for streaming effect
          await new Promise(resolve => setTimeout(resolve, 20));
        }
        
        ws.send(JSON.stringify({ type: 'done' }));
        return;
      }

      // Production mode - use real OpenRouter API
      try {
        const stream = await openai.chat.completions.create({
          model: 'openai/gpt-3.5-turbo',
          messages: [{ role: 'user', content: text }],
          stream: true,
          timeout: 30000,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            ws.send(JSON.stringify({ type: 'token', value: content }));
          }
        }

        ws.send(JSON.stringify({ type: 'done' }));
      } catch (apiError) {
        console.error('API Error:', apiError.message);
        let errorMessage = 'Failed to process message';
        
        if (apiError.status === 429) {
          errorMessage = 'API quota exceeded. Please check your OpenAI account billing. Using DEMO MODE for responses.';
        } else if (apiError.status === 401) {
          errorMessage = 'Invalid API key. Please check your OPENAI_API_KEY in .env file.';
        } else if (apiError.code === 'insufficient_quota') {
          errorMessage = 'OpenAI account has insufficient quota. Please add credits. Falling back to DEMO MODE.';
        } else if (apiError.code === 'ECONNREFUSED' || apiError.message.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to OpenAI API. Falling back to DEMO MODE.';
        }
        
        ws.send(JSON.stringify({ type: 'error', message: errorMessage }));
      }
    } catch (error) {
      console.error('Message handler error:', error.message);
      ws.send(JSON.stringify({ type: 'error', message: 'Failed to process message: ' + error.message }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});