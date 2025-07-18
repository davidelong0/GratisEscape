// AdminRichiestePage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../../services/api';
import {
  setNewMessage,
  removeRichiestaNotifica
} from '../../redux/notificationSlice';

const AdminRichiestePage = () => {
  const [richieste, setRichieste] = useState([]);
  const user = useSelector(state => state.auth.user);
  const notifiche = useSelector(state => state.notification.perRichiesta);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || user?.ruolo !== 'ADMIN') {
      navigate('/');
    } else {
      fetchRichieste();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchRichieste();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const handleChatClick = (id) => {
    dispatch(setNewMessage(false));
    dispatch(removeRichiestaNotifica(id));
    navigate(`/chat/${id}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Richieste utenti</h2>
      {richieste.length === 0 ? (
        <p>Nessuna richiesta presente.</p>
      ) : (
        <div className="row">
          {richieste.map(r => {
            const requestId = r.id || r._id;
            const hasNotifica = notifiche[requestId];

            return (
              <motion.div
                key={requestId}
                className="col-12 col-sm-6 col-md-4 col-lg-2 mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-100 shadow-sm" style={{ fontSize: '0.75rem' }}>
                  <Card.Body className="py-2 px-2 d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title className="mb-1" style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                        {r.oggetto || 'Richiesta'}
                        {hasNotifica && (
                          <span style={{
                            marginLeft: '6px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            width: '10px',
                            height: '10px',
                            display: 'inline-block'
                          }} />
                        )}
                      </Card.Title>

                      {(r.nome || r.cognome) && (
                        <Card.Subtitle className="mb-1" style={{ fontSize: '0.75rem', fontWeight: '500' }}>
                          {`${r.nome || ''} ${r.cognome || ''}`.trim()}
                        </Card.Subtitle>
                      )}

                      <Card.Subtitle className="mb-1 text-muted" style={{ fontSize: '0.7rem' }}>
                        {r.emailUtente}
                      </Card.Subtitle>

                      <Card.Text style={{ marginBottom: '0.5rem', fontSize: '0.7rem' }}>
                        <strong>Messaggio:</strong> {r.messaggio || r.testoRichiesta}
                      </Card.Text>
                    </div>

                    <div className="d-flex gap-1 mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleChatClick(requestId)}
                      >
                        Chat
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => eliminaRichiesta(requestId)}
                      >
                        Elimina
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminRichiestePage;
