"use client"
import { useState } from "react"

interface ChatInputProps {
  onSend: (text: string) => void
  disabled: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("")

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text)
    setText("")
  }

  return (
    <div className="flex gap-3 items-center">
      <input
        className="flex-1 border-2 border-gray-300 rounded-xl p-3 text-base text-gray-800 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-blue-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        placeholder={disabled ? "Connecting..." : "Type your message..."}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && !disabled && handleSend()}
        disabled={disabled}
      />
      <button 
        onClick={handleSend} 
        disabled={disabled || !text.trim()} 
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl transform"
      >
        {disabled ? "..." : "Send"}
      </button>
    </div>
  )
}
