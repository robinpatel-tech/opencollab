import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { getConversation } from '../services/api'
import { useAuth } from '../context/useAuth'

export default function Chat() {
  const { userId: otherUserId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const clientRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    // Load chat history
    getConversation(otherUserId).then(res => setMessages(res.data))

    // Connect WebSocket
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        setConnected(true)
        client.subscribe(`/user/${user.userId}/queue/messages`, (msg) => {
          const received = JSON.parse(msg.body)
          setMessages(prev => [...prev, {
            senderId: received.senderId,
            senderUsername: received.senderUsername,
            content: received.content,
            sentAt: received.sentAt,
          }])
        })
      },
    })

    client.activate()
    clientRef.current = client

    return () => client.deactivate()
  }, [otherUserId, user.userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !connected) return
    clientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({
        senderId: user.userId,
        senderUsername: user.username,
        receiverId: parseInt(otherUserId),
        content: input,
        type: 'CHAT',
      }),
    })
    setInput('')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-[600px]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
            {otherUserId}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">Collaborator</p>
            <p className={`text-xs ${connected ? 'text-green-500' : 'text-gray-400'}`}>
              {connected ? 'Connected' : 'Connecting...'}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.map((msg, i) => {
            const isMe = msg.senderId === user.userId
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                    {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], {
                      hour: '2-digit', minute: '2-digit'
                    }) : ''}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!connected}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}