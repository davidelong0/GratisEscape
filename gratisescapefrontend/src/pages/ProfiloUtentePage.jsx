import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import {
  setNewMessage,
  removeRichiestaNotifica,
  setNotifichePerRichieste
} from '../redux/notificationSlice';

const ProfiloUtentePage = () => {
  const { user } = useSelector((state) => state.auth);
  const notifiche = useSelector((state) => state.notification.perRichiesta);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [richieste, setRichieste] = useState([]);

  const checkUnreadMessages = async (richiesteList) => {
    try {
      const perRichiestaMap = { ...notifiche }; // preserva stato attuale
      let anyUnread = false;

      for (let r of richiesteList) {
        const unreadRes = await api.get(`/api/chat/${r.id}/unread?mittente=USER`);
        const isUnread = unreadRes.data.length > 0;

        // Applica sempre lo stato più aggiornato, senza sovrascrivere le richieste già lette
        perRichiestaMap[r.id] = perRichiestaMap[r.id] || isUnread;

        if (perRichiestaMap[r.id]) anyUnread = true;
      }

      dispatch(setNewMessage(anyUnread));
      dispatch(setNotifichePerRichieste(perRichiestaMap));
    } catch (err) {
      console.error('Errore durante il check delle notifiche', err);
    }
  };

  // 🔁 Primo load: richieste + notifiche
  useEffect(() => {
    const init = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const res = await api.get('/richieste/mie');
        const richiesteData = res.data;
        setRichieste(richiesteData);
        await checkUnreadMessages(richiesteData);
      } catch (err) {
        console.error('Errore nel caricamento richieste/notifiche', err);
        toast.error('Errore nel caricamento iniziale');
      }
    };

    init();
  }, [user?.email]);

  // 🔁 Polling ogni 5s solo per aggiornare richieste
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) fetchRichiesteUtente();
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchRichiesteUtente = async () => {
    try {
      const res = await api.get('/richieste/mie');
      setRichieste(res.data);
    } catch (err) {
      console.error('Errore nel caricamento delle richieste', err);
      toast.error('Errore nel caricamento delle richieste');
    }
  };

  const handleApriChat = (id) => {
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
  Richiesta ({new Date(r.dataCreazione).toLocaleDateString()})
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
