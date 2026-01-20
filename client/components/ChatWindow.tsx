"use client"
import { useState, useEffect } from "react"
import { useWebSocket } from "@/hooks/useWebSocket"
import { Message } from "@/types/chat"
import ChatInput from "./ChatInput"
import MessageBubble from "./MessageBubble"
import ConnectionStatus from "./ConnectionStatus"

export default function ChatWindow() {
  const { socketRef, status } = useWebSocket("ws://localhost:8081")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = (text: string) => {
    const ws = socketRef.current
    if (!ws) {
      setError("WebSocket not connected. Please refresh the page.")
      return
    }

    setError(null)
    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text, timestamp: new Date().toLocaleTimeString() }
    ])

    setLoading(true)
    ws.send(JSON.stringify({ text }))
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  useEffect(() => {
    const ws = socketRef.current
    if (!ws) return

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)

        if (data.type === "token") {
          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            
            // If the last message is from user or doesn't exist, add a new assistant message
            if (!lastMessage || lastMessage.role === "user") {
              newMessages.push({
                id: crypto.randomUUID(),
                role: "assistant",
                content: data.value,
                timestamp: new Date().toLocaleTimeString()
              })
            } else {
              // Append to existing assistant message
              lastMessage.content += data.value
            }
            
            return newMessages
          })
          setError(null)
        }

        if (data.type === "done") {
          setLoading(false)
          setError(null)
        }

        if (data.type === "error") {
          setError(data.message)
          setLoading(false)
          // Add error message as assistant response
          setMessages(prev => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: `[Error] ${data.message}`,
              timestamp: new Date().toLocaleTimeString()
            }
          ])
        }
      } catch (parseError) {
        console.error('Failed to parse WebSocket message:', parseError)
        setError('Failed to parse server response')
        setLoading(false)
      }
    }

    ws.onerror = () => {
      setError('WebSocket connection error')
      setLoading(false)
    }
  }, [socketRef])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Chat Assistant
          </h1>
          <p className="text-gray-600 text-lg">Real-time conversations powered by AI</p>
          
          {/* Clear Chat Button */}
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="absolute top-0 right-0 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-1"
              title="Clear chat history"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          )}
        </div>

        {/* Chat Container */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <ConnectionStatus status={status as "connecting" | "connected" | "disconnected" | "error"} />

          {/* Error Banner */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 mx-4 mt-3 rounded-lg animate-slideDown">
              <div className="flex items-start gap-3">
                <span className="text-red-600 font-bold text-lg">⚠️</span>
                <div>
                  <p className="text-red-800 font-semibold">Connection Issue</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                  {error.includes('Demo') && (
                    <p className="text-orange-600 text-xs mt-2 font-medium">💡 Running in demo mode - responses are simulated</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="h-[70vh] overflow-y-auto p-6 bg-gradient-to-b from-white/50 to-gray-50/50">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xl mb-2">Welcome to AI Chat!</p>
                    <p className="text-gray-400 text-sm">Start a conversation by typing a message below</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-6">
                    {["Hello!", "How are you?", "Tell me a joke", "What's the weather like?"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        disabled={status !== "connected"}
                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-blue-700 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {messages.map(m => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {loading && (
              <div className="flex justify-start mb-4 animate-fadeIn">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-gradient-to-t from-white/80 to-gray-50/80 border-t border-gray-100/50">
            <ChatInput onSend={sendMessage} disabled={loading || status !== "connected"} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Built with Next.js, WebSocket, and OpenAI</p>
        </div>
      </div>
    </div>
  )
}
