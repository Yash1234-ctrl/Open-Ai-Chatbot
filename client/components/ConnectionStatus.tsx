type Props = {
  status: "connecting" | "connected" | "disconnected" | "error"
}

export default function ConnectionStatus({ status }: Props) {
  const statusConfig = {
    connected: { color: "bg-green-500", bgGradient: "from-green-50 to-emerald-50", text: "Connected", icon: "✓" },
    connecting: { color: "bg-yellow-500", bgGradient: "from-yellow-50 to-amber-50", text: "Connecting...", icon: "⟳" },
    disconnected: { color: "bg-red-500", bgGradient: "from-red-50 to-pink-50", text: "Disconnected", icon: "✕" },
    error: { color: "bg-red-600", bgGradient: "from-red-50 to-orange-50", text: "Error", icon: "!" }
  }

  const config = statusConfig[status]

  return (
    <div className={`flex items-center gap-3 px-4 py-3 text-sm bg-gradient-to-r ${config.bgGradient} border-b border-gray-100 transition-all duration-300`}>
      <div className={`w-3 h-3 rounded-full ${config.color} ${status === "connecting" ? "animate-pulse" : ""} shadow-sm`} />
      <span className="font-semibold text-gray-700">{config.text}</span>
      {status === "connected" && <span className="text-green-600 ml-auto text-xs font-medium animate-fadeIn">Ready to chat</span>}
    </div>
  )
}
