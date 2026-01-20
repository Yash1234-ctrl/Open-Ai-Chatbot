type Props = {
  message: {
    role: "user" | "assistant"
    content: string
    timestamp: string
  }
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user"

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"} animate-slideIn`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all duration-300 ${
          isUser
            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none shadow-lg hover:shadow-xl"
            : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 rounded-bl-none shadow-md hover:shadow-lg"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p className={`text-xs mt-2 opacity-75 ${isUser ? "text-blue-100" : "text-gray-600"}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  )
}
