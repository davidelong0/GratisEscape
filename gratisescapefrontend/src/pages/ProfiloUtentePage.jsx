import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'
import { motion } from 'framer-motion'

const ProfiloUtentePage = () => {
  const user = useSelector(state => state.auth.user)
  const navigate = useNavigate()
  const [richieste, setRichieste] = useState([])
  const [viaggi, setViaggi] = useState([])

  useEffect(() => {
    if (!user) navigate('/login')
    else {
      fetchRichieste()
      fetchViaggi()
    }
  }, [user])

  const fetchRichieste = async () => {
    try {
      const res = await api.get('/richieste')
      const userRichieste = res.data.filter(r => r.emailUtente === user.email)
      setRichieste(userRichieste)
    } catch (err) {
      console.error('Errore caricamento richieste utente', err)
    }
  }

  const fetchViaggi = async () => {
    try {
      const res = await api.get('/viaggi')
      const userViaggi = res.data.filter(v => v.destinazione.toLowerCase().includes(user.cognome.toLowerCase()))
      setViaggi(userViaggi)
    } catch (err) {
      console.error('Errore caricamento viaggi', err)
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Il mio profilo</h2>
      <p><strong>Nome:</strong> {user?.nome}</p>
      <p><strong>Email:</strong> {user?.email}</p>

      <hr />

      <h4>Le mie richieste personalizzate</h4>
      {richieste.length === 0 ? <p>Nessuna richiesta inviata.</p> : (
        richieste.map(r => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
          >
            <Card>
              <Card.Body>
                <Card.Title>{r.oggetto || 'Richiesta #' + r.id}</Card.Title>
                <Card.Text>{r.messaggio}</Card.Text>
                <Link to={`/chat/${r.id}`} className="btn btn-outline-primary">Apri chat</Link>
              </Card.Body>
            </Card>
          </motion.div>
        ))
      )}

      <hr />

      <h4>I miei viaggi visualizzati</h4>
      {viaggi.length === 0 ? <p>Nessun viaggio visualizzato o prenotato.</p> : (
        viaggi.map(v => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
          >
            <Card>
              <Card.Body>
                <Card.Title>{v.nome}</Card.Title>
                <Card.Text>{v.destinazione}</Card.Text>
                <Link to={`/viaggi/${v.id}`} className="btn btn-primary">Dettagli</Link>
              </Card.Body>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}

export default ProfiloUtentePage