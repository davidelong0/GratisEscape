import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminRichiestePage = () => {
  const [richieste, setRichieste] = useState([]);
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
      setRichieste(res.data);
    } catch (err) {
      console.error('Errore caricamento richieste', err);
    }
  };

  const eliminaRichiesta = async (id) => {
    if (!id) {
      alert("Errore: ID richiesta non valido");
      return;
    }
    if (window.confirm('Sei sicuro di voler eliminare questa richiesta?')) {
      try {
        await api.delete(`/richieste/${id}`);
        alert('Richiesta eliminata con successo');
        fetchRichieste();
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
          const requestId = r.id || r._id;
          return (
            <motion.div
              key={requestId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-2"
            >
              <Card style={{ fontSize: '0.9rem' }}>
                <Card.Body className="py-2 px-3">
                  <Card.Title className="mb-1" style={{ fontWeight: '600', fontSize: '1rem' }}>
                    {r.oggetto || ''}
                  </Card.Title>

                  {(r.nome || r.cognome) && (
                    <Card.Subtitle className="mb-1" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                      {`${r.nome || ''} ${r.cognome || ''}`.trim()}
                    </Card.Subtitle>
                  )}

                  <Card.Subtitle className="mb-1 text-muted" style={{ fontSize: '0.85rem' }}>
                    {r.emailUtente}
                  </Card.Subtitle>

                  <Card.Text style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <strong>Messaggio:</strong> {r.messaggio || r.testoRichiesta}
                  </Card.Text>

                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/chat/${requestId}`)}
                    >
                      Apri chat
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => eliminaRichiesta(requestId)}
                    >
                      Elimina richiesta
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default AdminRichiestePage;
