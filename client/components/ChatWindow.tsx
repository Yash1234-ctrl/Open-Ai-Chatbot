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
      { id: crypto.randomUUID(), role: "user", content: text, timestamp: new Date().toLocaleTimeString() },
      { id: crypto.randomUUID(), role: "assistant", content: "", timestamp: new Date().toLocaleTimeString() }
    ])

    setLoading(true)
    ws.send(JSON.stringify({ text }))
  }

  useEffect(() => {
    const ws = socketRef.current
    if (!ws) return

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)

        if (data.type === "token") {
          setMessages(prev => {
            const last = prev[prev.length - 1]
            if (last) {
              last.content += data.value
            }
            return [...prev]
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
          // Keep the message so user can see it, but mark it as error
          setMessages(prev => {
            const messages = [...prev]
            if (messages.length > 0) {
              messages[messages.length - 1].content = `[Error] ${data.message}`
            }
            return messages
          })
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
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 backdrop-blur-sm">
        <ConnectionStatus status={status as "connecting" | "connected" | "disconnected" | "error"} />
        
        {error && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 p-4 mx-4 mt-3 rounded-lg animate-slideDown">
            <div className="flex items-start gap-3">
              <span className="text-orange-600 font-bold text-lg">⚠️</span>
              <div>
                <p className="text-orange-800 font-semibold">Warning</p>
                <p className="text-orange-700 text-sm mt-1">{error}</p>
                {error.includes('Demo') && (
                  <p className="text-orange-600 text-xs mt-2 font-medium">💡 Running in demo mode - responses are simulated</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="h-[60vh] overflow-y-auto p-4 bg-gradient-to-b from-white to-gray-50 border-b border-gray-100">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-400 text-lg mb-2">Start chatting to begin...</p>
                <p className="text-gray-300 text-sm">Try saying "Hello" or "How are you?"</p>
              </div>
            </div>
          )}
          {messages.map(m => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 text-gray-900 rounded-lg rounded-bl-none px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gradient-to-t from-gray-50 to-white border-t border-gray-100">
          <ChatInput onSend={sendMessage} disabled={loading || status !== "connected"} />
        </div>
      </div>
    </div>
  )
}
