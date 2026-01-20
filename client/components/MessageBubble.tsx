type Props = {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: string
  }
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user"

  return (
    <div className={`mb-6 flex ${isUser ? "justify-end" : "justify-start"} animate-slideIn`}>
      <div className="flex items-start gap-3 max-w-[80%]">
        {/* Avatar */}
        {!isUser && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all duration-300 hover:scale-[1.02] ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md shadow-lg hover:shadow-xl"
              : "bg-gradient-to-br from-white to-gray-50 text-gray-900 rounded-bl-md shadow-md hover:shadow-lg border border-gray-100"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <p className={`text-xs mt-2 ${isUser ? "text-blue-100" : "text-gray-500"}`}>
            {message.timestamp}
          </p>
        </div>

        {/* User Avatar */}
        {isUser && (
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white text-sm font-bold">You</span>
          </div>
        )}
      </div>
    </div>
  )
}
