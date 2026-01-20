type Props = {
  status: "connecting" | "connected" | "disconnected" | "error"
}

export default function ConnectionStatus({ status }: Props) {
  const statusConfig = {
    connected: {
      color: "bg-green-500",
      bgGradient: "from-green-50 to-emerald-50",
      text: "Connected",
      icon: "🟢",
      subtext: "Ready to chat"
    },
    connecting: {
      color: "bg-yellow-500",
      bgGradient: "from-yellow-50 to-amber-50",
      text: "Connecting...",
      icon: "🟡",
      subtext: "Establishing connection"
    },
    disconnected: {
      color: "bg-red-500",
      bgGradient: "from-red-50 to-pink-50",
      text: "Disconnected",
      icon: "🔴",
      subtext: "Check your connection"
    },
    error: {
      color: "bg-red-600",
      bgGradient: "from-red-50 to-orange-50",
      text: "Connection Error",
      icon: "❌",
      subtext: "Unable to connect"
    }
  }

  const config = statusConfig[status]

  return (
    <div className={`flex items-center justify-between px-6 py-4 text-sm bg-gradient-to-r ${config.bgGradient} border-b border-gray-100/50 transition-all duration-300`}>
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${config.color} shadow-sm ${status === "connecting" ? "animate-pulse" : ""}`} />
        <div>
          <span className="font-semibold text-gray-700">{config.text}</span>
          <p className="text-xs text-gray-600 mt-0.5">{config.subtext}</p>
        </div>
      </div>

      {status === "connected" && (
        <div className="flex items-center gap-2 text-green-600">
          <span className="text-xs font-medium">Live</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  )
}
