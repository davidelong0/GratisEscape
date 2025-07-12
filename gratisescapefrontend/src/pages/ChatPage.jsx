import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from '@stomp/stompjs'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const ChatPage = () => {
  const { richiestaId } = useParams()
  const { user } = useSelector(state => state.auth)

  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const stompClientRef = useRef(null)

  useEffect(() => {
    // Recupero cronologia messaggi
    api.get(`/chat/${richiestaId}`)
      .then(res => setMessages(res.data))
      .catch(() => toast.error('Errore nel recupero della chat'))

    // Connessione WebSocket
    const socket = new SockJS('http://localhost:8080/ws')
    const stomp = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stomp.subscribe('/topic/public', (msg) => {
          const newMsg = JSON.parse(msg.body)
          if (newMsg.richiestaId === parseInt(richiestaId)) {
            setMessages(prev => [...prev, newMsg])
          }
        })
      },
      onStompError: (frame) => {
        console.error('Errore STOMP', frame)
        toast.error('Errore WebSocket')
      }
    })

    stomp.activate()
    stompClientRef.current = stomp

    return () => {
      if (stomp.connected) stomp.deactivate()
    }
  }, [richiestaId])

  const sendMessage = () => {
    if (!text.trim()) return
    const msg = {
      richiestaId: parseInt(richiestaId),
      mittente: user.email,
      messaggio: text
    }

    stompClientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(msg)
    })

    setText('')
  }

  return (
    <div className="container mt-5">
      <h3>Chat richiesta #{richiestaId}</h3>
      <div className="border p-3 mb-3" style={{ height: '400px', overflowY: 'scroll' }}>
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.mittente === user.email ? 'text-end' : 'text-start'}`}>
            <strong>{m.mittente}:</strong> <span>{m.messaggio}</span>
          </div>
        ))}
      </div>
      <div className="input-group">
        <input
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Scrivi un messaggio..."
        />
        <button className="btn btn-primary" onClick={sendMessage}>Invia</button>
      </div>
    </div>
  )
}

export default ChatPage
