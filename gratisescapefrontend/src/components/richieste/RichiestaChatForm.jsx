import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';

const RichiestaChatForm = () => {
  const [destinazione, setDestinazione] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const stompClient = useRef(null);

  // Inizializza WebSocket all'avvio
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws-chat');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.current = client;
      },
    });
    client.activate();

    return () => {
      if (client.connected) client.deactivate();
    };
  }, []);

  const handleInvioRichiesta = async (e) => {
    e.preventDefault();

    if (!user || !user.email) {
      toast.error("Utente non autenticato!");
      return;
    }

    try {
      const res = await api.post('/richieste', {
        testoRichiesta: `Destinazione: ${destinazione}\n\n${descrizione}`
        // emailUtente lo prende dal token JWT
      });

      const richiestaId = res.data.id;

      // Invia notifica "fittizia" via WebSocket per attivare badge lato admin
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify({
            richiestaId,
            mittente: 'USER',
            messaggio: 'Salve, avrei bisogno di informazioni',
            emailDestinatario: 'ADMIN'
          }),
        });
        
      }

      toast.success("Richiesta inviata! Puoi iniziare la chat");
      navigate(`/chat/${richiestaId}`);
    } catch (error) {
      console.error(error.response || error);
      toast.error("Errore nell'invio della richiesta: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container mt-4">
      <h4>Richiesta tramite chat</h4>
      <form onSubmit={handleInvioRichiesta}>
        <div className="mb-3">
          <label className="form-label">Destinazione desiderata</label>
          <input
            type="text"
            className="form-control"
            value={destinazione}
            onChange={(e) => setDestinazione(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descrivi la tua richiesta</label>
          <textarea
            className="form-control"
            rows={4}
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-outline-gold">
          Invia richiesta e apri chat
        </button>
      </form>
    </div>
  );
};

export default RichiestaChatForm;
