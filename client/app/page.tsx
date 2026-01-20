import ChatWindow from "@/components/ChatWindow"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💬 Realtime AI Chatbot</h1>
          <p className="text-gray-600">Chat with AI powered by OpenAI</p>
        </div>
        <ChatWindow />
      </div>
    </div>
  )
}
