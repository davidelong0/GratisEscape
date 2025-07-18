// ProfiloUtentePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import {
  setNewMessage,
  removeRichiestaNotifica
} from '../redux/notificationSlice';

const ProfiloUtentePage = () => {
  const { user } = useSelector((state) => state.auth);
  const notifiche = useSelector((state) => state.notification.perRichiesta);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [richieste, setRichieste] = useState([]);

  const fetchRichiesteUtente = async () => {
    try {
      const res = await api.get('/richieste/mie');
      setRichieste(res.data);
    } catch (err) {
      console.error('Errore nel caricamento delle richieste', err);
      toast.error('Errore nel caricamento delle richieste');
    }
  };

  useEffect(() => {
    if (!user) navigate('/login');
    else fetchRichiesteUtente();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchRichiesteUtente();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApriChat = (id) => {
    dispatch(setNewMessage(false));
    dispatch(removeRichiestaNotifica(id));
    navigate(`/chat/${id}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-gold mb-4">Profilo Utente</h2>
      <p><strong>Nome:</strong> {user?.nome}</p>
      <p><strong>Email:</strong> {user?.email}</p>

      <hr className="my-4" />

      <h4 className="text-gold mb-3">Le mie richieste personalizzate</h4>
      {richieste.length === 0 ? (
        <p>Nessuna richiesta inviata.</p>
      ) : (
        richieste.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
          >
            <Card>
              <Card.Body>
                <Card.Title className="request-text">
                  Richiesta
                  {notifiche[r.id] && (
                    <span style={{
                      marginLeft: '8px',
                      backgroundColor: 'red',
                      borderRadius: '50%',
                      width: '10px',
                      height: '10px',
                      display: 'inline-block'
                    }} />
                  )}
                </Card.Title>
                <Card.Text>{r.testoRichiesta}</Card.Text>
                <button className="btn btn-request" onClick={() => handleApriChat(r.id)}>
                  Apri chat
                </button>
              </Card.Body>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default ProfiloUtentePage;
