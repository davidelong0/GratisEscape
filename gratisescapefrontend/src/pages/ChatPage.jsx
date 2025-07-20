import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import SockJS from 'sockjs-client/dist/sockjs'
import { Client } from '@stomp/stompjs'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import {
  setNewMessage,
  removeRichiestaNotifica,
  setNotificaRichiesta
} from '../redux/notificationSlice'

const ChatPage = () => {
  const { richiestaId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [utenteRichiesta, setUtenteRichiesta] = useState(null)
  const stompClientRef = useRef(null)

  useEffect(() => {
    if (!user || !user.email) {
      setLoading(false)
      return
    }

    dispatch(setNewMessage(false))
    dispatch(removeRichiestaNotifica(parseInt(richiestaId)))

    // 🔴 Marca i messaggi della chat attuale come letti
    api.put(`/api/chat/${richiestaId}/mark-read?mittente=${user.ruolo}`).catch(() => {})

    // 🔴 Carica la chat
    api.get(`/api/chat/${richiestaId}`)
      .then(res => {
        setMessages(res.data)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Errore nel recupero della chat')
        setLoading(false)
      })

    // Solo lato admin: recupera info utente
    if (user.ruolo === 'ADMIN') {
      api.get(`/richieste/${richiestaId}/dettagli`)
        .then(res => {
          if (res.data) {
            setUtenteRichiesta({
              nome: res.data.nomeUtente,
              cognome: res.data.cognomeUtente
            })
          }
        })
        .catch(() => {
          console.error('Errore nel recupero utente della richiesta')
        })
    }

    const socket = new SockJS('http://localhost:8080/ws-chat')
    const stomp = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stomp.subscribe('/topic/public', (msg) => {
          const newMsg = JSON.parse(msg.body)

          const isCurrentChat = newMsg.richiestaId === parseInt(richiestaId)
          const isFromMe = (user.ruolo === 'ADMIN' && newMsg.mittente === 'ADMIN') ||
                           (user.ruolo !== 'ADMIN' && newMsg.mittente === 'USER')

          if (isCurrentChat) {
            setMessages(prev => [...prev, newMsg])
            if (!isFromMe) {
              api.put(`/api/chat/${richiestaId}/mark-read?mittente=${user.ruolo}`).catch(() => {})
              dispatch(removeRichiestaNotifica(parseInt(richiestaId)))
            }
          } else {
            if (!isFromMe) {
              dispatch(setNewMessage(true))
              dispatch(setNotificaRichiesta({ richiestaId: newMsg.richiestaId, value: true }))
            }
          }
        })
      },
      onStompError: () => {
        toast.error('Errore WebSocket')
      }
    })

    stomp.activate()
    stompClientRef.current = stomp

    return () => {
      if (stomp.connected) stomp.deactivate()
    }
  }, [richiestaId, user, dispatch])

  const sendMessage = () => {
    if (!text.trim()) return

    if (stompClientRef.current && stompClientRef.current.connected) {
      const msg = {
        richiestaId: parseInt(richiestaId),
        mittente: user.ruolo === 'ADMIN' ? 'ADMIN' : 'USER',
        messaggio: text
      }

      stompClientRef.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(msg)
      })

      setText('')
    } else {
      toast.error("Connessione non attiva. Attendi...")
    }
  }

  if (!user) return <div className="container mt-5">Caricamento utente...</div>
  if (loading) return <div className="container mt-5">Caricamento messaggi...</div>

  return (
    <div className="container mt-5">
      <h3>
  Chat con{' '}
  {user.ruolo === 'ADMIN'
    ? utenteRichiesta
      ? `${utenteRichiesta.nome} ${utenteRichiesta.cognome}`
      : 'Utente'
    : 'GratisEscape'}
</h3>

      <div className="border p-3 mb-3" style={{ height: '400px', overflowY: 'scroll' }}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${
              m.mittente === (user.ruolo === 'ADMIN' ? 'ADMIN' : 'USER')
                ? 'text-end'
                : 'text-start'
            }`}
          >
            <strong>
              {m.mittente === 'ADMIN'
                ? 'GratisEscape'
                : user.ruolo === 'ADMIN'
                  ? utenteRichiesta
                    ? `${utenteRichiesta.nome} ${utenteRichiesta.cognome}`
                    : 'Utente'
                  : `${user.nome} ${user.cognome}`}
              :
            </strong>{' '}
            <span>{m.messaggio}</span>
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
        <button className="btn btn-outline-gold" onClick={sendMessage}>
          Invia
        </button>
      </div>
    </div>
  )
}

export default ChatPage
