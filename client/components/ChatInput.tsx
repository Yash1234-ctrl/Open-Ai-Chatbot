"use client"
import { useState, useRef, useEffect } from "react"

interface ChatInputProps {
  onSend: (text: string) => void
  disabled: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText("")
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && text.trim()) {
        handleSend()
      }
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [text])

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            className="w-full border-2 border-gray-200 rounded-2xl p-4 text-base text-gray-800 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-blue-50/30 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 shadow-sm resize-none min-h-[50px] max-h-32"
            placeholder={disabled ? "Connecting..." : "Type your message... (Enter to send, Shift+Enter for new line)"}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
          />
          {text.length > 0 && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {text.length}
            </div>
          )}
        </div>
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl transform flex items-center gap-2"
        >
          {disabled ? (
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-100"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-200"></div>
            </div>
          ) : (
            <>
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Typing indicator hint */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  )
}
