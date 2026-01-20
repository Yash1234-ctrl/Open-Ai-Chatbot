# Realtime AI Chatbot

A modern, real-time chatbot application built with Next.js and WebSocket technology, powered by OpenAI's API.

## Features

✨ **Real-time Chat Interface**
- Live streaming of AI responses
- Beautiful, responsive UI with Tailwind CSS
- Connection status indicator
- Error handling and recovery

🤖 **AI-Powered Responses**
- Powered by OpenAI's GPT-3.5 Turbo model
- Real-time token streaming for responsive interaction
- Demo mode for testing without API key

🔧 **Developer-Friendly**
- TypeScript support
- ESLint configured
- Modular component architecture
- WebSocket server with Node.js

## Project Structure

```
realtime-ai-chatbot/
├── client/              # Next.js frontend application
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript types
│   └── public/         # Static assets
│
└── server/             # Node.js WebSocket server
    ├── index.js        # Main server file
    └── .env            # Environment configuration
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (for real AI responses) - Optional (demo mode available)

### Installation

1. **Install Client Dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

### Configuration

1. **Set OpenAI API Key** (Optional)
   ```bash
   cd server
   ```

   Edit `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```

   > **Note:** If you don't have an API key, the chatbot will run in **DEMO MODE** with simulated responses.

### Running the Application

1. **Start the WebSocket Server**
   ```bash
   cd server
   npm start
   ```
   The server will start on `http://localhost:8081`

2. **Start the Frontend (in another terminal)**
   ```bash
   cd client
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

3. **Open in Browser**
   Navigate to `http://localhost:3000` and start chatting!

## Usage

1. Open the chatbot at `http://localhost:3000`
2. Wait for the connection status to show "Connected"
3. Type your message in the input field
4. Press Enter or click the "Send" button
5. Watch as the AI streams its response in real-time

### Demo Mode

If you don't have an OpenAI API key or it runs out of quota, the chatbot automatically switches to **DEMO MODE**:
- Responds with simulated messages
- Tests the UI and interaction flow
- Demonstrates streaming functionality
- Useful for development and testing

Try these demo prompts:
- "Hello"
- "How are you?"
- "Test"
- "Help"

## API Responses

The WebSocket server sends JSON messages with the following types:

### Token Message
```json
{
  "type": "token",
  "value": "Single character or partial token"
}
```

### Done Message
```json
{
  "type": "done"
}
```

### Error Message
```json
{
  "type": "error",
  "message": "Error description"
}
```

## Troubleshooting

### "Failed to process message" Error

**Problem:** You're seeing an error when sending messages

**Solutions:**
1. **Check WebSocket Connection**
   - Ensure the server is running: `cd server && npm start`
   - Check if it shows "WebSocket server started on port 8081"

2. **Check API Key**
   - If using OpenAI API, verify the key is valid in `server/.env`
   - If quota exceeded, the app automatically uses DEMO MODE

3. **Check Logs**
   - Look at server console for error messages
   - Check browser console for client-side errors

4. **Restart Services**
   ```bash
   # Stop both server and client (Ctrl+C)
   # Then restart:
   cd server && npm start    # Terminal 1
   cd client && npm run dev  # Terminal 2
   ```

### Connection Issues

- **"Connecting" forever:** Server may not be running, check `http://localhost:8081`
- **"Disconnected":** Server crashed or network issue, restart server
- **Port already in use:** Change the port in `server/index.js` or `client` config

## Development

### Building for Production

```bash
cd client
npm run build
npm start
```

### Linting

```bash
cd client
npm run lint
```

## Technologies Used

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **ESLint** - Code quality

### Backend
- **Node.js** - Runtime
- **WebSocket (ws)** - Real-time communication
- **OpenAI API** - AI responses
- **dotenv** - Environment configuration

## Features Explained

### Real-Time Streaming
The server streams AI responses token-by-token for a natural, responsive experience. Each character is sent as it's generated.

### Error Handling
Comprehensive error handling with user-friendly messages:
- API quota exceeded → Auto-fallback to demo mode
- Connection errors → Clear status indicator
- Invalid messages → Immediate feedback

### Component Architecture
- **ChatWindow:** Main chat container
- **ChatInput:** Message input with Enter key support
- **MessageBubble:** Styled message display
- **ConnectionStatus:** WebSocket connection indicator
- **useWebSocket:** Custom hook for WebSocket management

## Future Enhancements

- [ ] Message persistence/history
- [ ] Multiple conversation threads
- [ ] User authentication
- [ ] Model selection (GPT-4, etc.)
- [ ] Message editing and deletion
- [ ] Export conversations
- [ ] Dark mode toggle
- [ ] Mobile app

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server and browser console logs
3. Verify configuration files (.env)
4. Ensure all dependencies are installed
