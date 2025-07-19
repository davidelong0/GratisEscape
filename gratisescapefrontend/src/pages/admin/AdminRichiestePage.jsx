import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../../services/api';
import {
  setNewMessage,
  removeRichiestaNotifica,
  setNotifichePerRichieste
} from '../../redux/notificationSlice';

const AdminRichiestePage = () => {
  const [richieste, setRichieste] = useState([]);
  const user = useSelector(state => state.auth.user);
  const notifiche = useSelector(state => state.notification.perRichiesta);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkUnreadMessages = async (richiesteList) => {
    try {
      const perRichiestaMap = { ...notifiche }; // preserva stato attuale
      let anyUnread = false;

      for (let r of richiesteList) {
        const res = await api.get(`/api/chat/${r.id}/unread?mittente=ADMIN`);
        const isUnread = res.data.length > 0;

        // Applica sempre lo stato più aggiornato, senza sovrascrivere le richieste già lette
        perRichiestaMap[r.id] = perRichiestaMap[r.id] || isUnread;

        if (perRichiestaMap[r.id]) anyUnread = true;
      }

      dispatch(setNewMessage(anyUnread));
      dispatch(setNotifichePerRichieste(perRichiestaMap));
    } catch (err) {
      console.warn("Errore durante il recupero delle notifiche non lette", err);
    }
  };

  // 🔁 Al primo caricamento: fetch richieste + notifiche
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token || user?.ruolo !== 'ADMIN') {
        navigate('/');
        return;
      }

      try {
        const res = await api.get('/richieste');
        const richiesteData = res.data;
        setRichieste(richiesteData);
        await checkUnreadMessages(richiesteData);
      } catch (err) {
        console.error('Errore iniziale nel caricamento delle richieste o notifiche', err);
      }
    };

    init();
  }, [user?.email]);

  // 🔁 Polling ogni 5s (senza ricalcolo notifiche)
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.ruolo === 'ADMIN') fetchRichieste();
    }, 5000);
    return () => clearInterval(interval);
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
    if (!id) return alert("Errore: ID richiesta non valido");
    if (window.confirm('Sei sicuro di voler eliminare questa richiesta?')) {
      try {
        await api.delete(`/richieste/${id}`);
        alert('Richiesta eliminata con successo');
        fetchRichieste();
      } catch (err) {
        console.error('Errore eliminazione richiesta:', err);
        if (err.response) {
          alert(`Errore: ${err.response.status} - ${err.response.data}`);
        } else {
          alert('Errore di rete o server');
        }
      }
    }
  };

  const handleChatClick = (id) => {
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
