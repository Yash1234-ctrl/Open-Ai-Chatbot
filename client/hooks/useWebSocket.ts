import { useEffect, useRef, useState, useCallback } from "react"

export function useWebSocket(url: string) {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected" | "error">("connecting")
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 3
  const isConnectingRef = useRef(false)

  const connect = useCallback(() => {
    // Prevent multiple simultaneous connection attempts
    if (isConnectingRef.current || (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)) {
      return
    }

    isConnectingRef.current = true
    setStatus("connecting")

    try {
      const ws = new WebSocket(url)

      ws.onopen = () => {
        console.log('WebSocket connected successfully')
        setStatus("connected")
        reconnectAttempts.current = 0
        isConnectingRef.current = false
      }

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setStatus("disconnected")
        socketRef.current = null
        isConnectingRef.current = false

        // Attempt to reconnect if not a normal closure and within max attempts
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000) // Exponential backoff, max 10s
          console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts}) in ${delay}ms...`)
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setStatus("error")
        isConnectingRef.current = false
      }

      socketRef.current = ws
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setStatus("error")
      isConnectingRef.current = false
    }
  }, [url])

  useEffect(() => {
    connect()

    return () => {
      isConnectingRef.current = false
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close(1000, "Component unmounting")
      }
    }
  }, [connect])

  return { socketRef, status }
}
