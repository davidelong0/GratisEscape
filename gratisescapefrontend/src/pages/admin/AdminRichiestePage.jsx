import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { Card, Button, Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminRichiestePage = () => {
  const [richieste, setRichieste] = useState([])
  const [risposte, setRisposte] = useState({})
  const user = useSelector(state => state.auth.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.ruolo || user.ruolo !== 'ADMIN') {
      navigate('/')
    } else {
      fetchRichieste()
    }
  }, [user])

  const fetchRichieste = async () => {
    try {
      const res = await api.get('/richieste')
      setRichieste(res.data)
    } catch (err) {
      console.error('Errore caricamento richieste', err)
    }
  }

  const handleChange = (id, value) => {
    setRisposte(prev => ({ ...prev, [id]: value }))
  }

  const inviaRisposta = async (id) => {
    try {
      await api.post(`/richieste/${id}/rispondi`, { risposta: risposte[id] })
      alert('Risposta inviata con successo')
      setRisposte(prev => ({ ...prev, [id]: '' }))
    } catch (err) {
      console.error('Errore invio risposta', err)
      alert('Errore invio risposta')
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Richieste utenti</h2>
      {richieste.length === 0 ? <p>Nessuna richiesta presente.</p> : (
        richieste.map(r => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <Card>
              <Card.Body>
                <Card.Title>{r.oggetto || 'Richiesta #' + r.id}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{r.emailUtente}</Card.Subtitle>
                <Card.Text><strong>Messaggio:</strong> {r.messaggio}</Card.Text>

                <Form.Group>
                  <Form.Label>Rispondi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={risposte[r.id] || ''}
                    onChange={(e) => handleChange(r.id, e.target.value)}
                  />
                </Form.Group>

                <Button
                  className="mt-2 me-2"
                  variant="success"
                  onClick={() => inviaRisposta(r.id)}
                >
                  Invia risposta via email
                </Button>

                <Button
                  className="mt-2"
                  variant="outline-primary"
                  onClick={() => navigate(`/chat/${r.id}`)}
                >
                  Apri chat
                </Button>
              </Card.Body>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}

export default AdminRichiestePage
