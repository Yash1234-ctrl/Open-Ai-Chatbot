import { useEffect, useRef, useState } from "react"

export function useWebSocket(url: string) {
  const [status, setStatus] = useState("disconnected")
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket(url)

    ws.onopen = () => setStatus("connected")
    ws.onclose = () => setStatus("disconnected")
    ws.onerror = () => setStatus("error")

    socketRef.current = ws

    return () => ws.close()
  }, [url])

  return { socketRef, status }
}
