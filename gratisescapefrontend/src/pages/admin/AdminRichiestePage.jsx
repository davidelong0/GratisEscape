import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminRichiestePage = () => {
  const [richieste, setRichieste] = useState([]);
  const [risposte, setRisposte] = useState({});
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.ruolo || user.ruolo !== 'ADMIN') {
      navigate('/');
    } else {
      fetchRichieste();
    }
  }, [user]);

  const fetchRichieste = async () => {
    try {
      const res = await api.get('/richieste');
      console.log("Richieste ricevute dal backend:", res.data);
      setRichieste(res.data);
    } catch (err) {
      console.error('Errore caricamento richieste', err);
    }
  };

  const handleChange = (id, value) => {
    setRisposte(prev => ({ ...prev, [id]: value }));
  };

  const inviaRisposta = async (id) => {
    try {
      await api.post(`/richieste/${id}/rispondi`, { risposta: risposte[id] });
      alert('Risposta inviata con successo');
      setRisposte(prev => ({ ...prev, [id]: '' }));
      fetchRichieste(); // aggiorna la lista dopo la risposta
    } catch (err) {
      console.error('Errore invio risposta', err);
      alert('Errore invio risposta');
    }
  };

  const eliminaRichiesta = async (id) => {
    console.log("Chiamo DELETE /richieste/" + id);
    if (!id) {
      alert("Errore: ID richiesta non valido");
      return;
    }
    if (window.confirm('Sei sicuro di voler eliminare questa richiesta?')) {
      try {
        const response = await api.delete(`/richieste/${id}`);
        console.log("Risposta DELETE:", response);
        alert('Richiesta eliminata con successo');
        fetchRichieste(); // aggiorna la lista dopo l'eliminazione
      } catch (err) {
        console.error('Errore eliminazione richiesta:', err);
        if (err.response) {
          alert(`Errore eliminazione richiesta: ${err.response.status} - ${err.response.data}`);
        } else {
          alert('Errore eliminazione richiesta: errore di rete o server');
        }
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Richieste utenti</h2>
      {richieste.length === 0 ? (
        <p>Nessuna richiesta presente.</p>
      ) : (
        richieste.map(r => {
          // Log per capire come sono i dati
          console.log("Singola richiesta in map:", r);
          // Qui verifica se 'id' esiste, altrimenti usa '_id'
          const requestId = r.id || r._id;
          return (
            <motion.div
              key={requestId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <Card>
                <Card.Body>
                  <Card.Title>{r.oggetto || 'Richiesta #' + requestId}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{r.emailUtente}</Card.Subtitle>
                  <Card.Text><strong>Messaggio:</strong> {r.messaggio || r.testoRichiesta}</Card.Text>

                  <Form.Group>
                    <Form.Label>Rispondi</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={risposte[requestId] || ''}
                      onChange={(e) => handleChange(requestId, e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    className="mt-2 me-2"
                    variant="success"
                    onClick={() => inviaRisposta(requestId)}
                  >
                    Invia risposta via email
                  </Button>

                  <Button
                    className="mt-2 me-2"
                    variant="outline-primary"
                    onClick={() => navigate(`/chat/${requestId}`)}
                  >
                    Apri chat
                  </Button>

                  <Button
                    className="mt-2"
                    variant="outline-danger"
                    onClick={() => eliminaRichiesta(requestId)}
                  >
                    Elimina richiesta
                  </Button>

                </Card.Body>
              </Card>
            </motion.div>
          )
        })
      )}
    </div>
  );
};

export default AdminRichiestePage;
