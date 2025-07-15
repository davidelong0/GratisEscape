import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const RichiestaChatForm = () => {
  const [destinazione, setDestinazione] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);

  const handleInvioRichiesta = async (e) => {
    e.preventDefault();

    if (!user || !user.email) {
      toast.error("Utente non autenticato!");
      return;
    }

    try {
      const res = await api.post('/richieste', {
        testoRichiesta: `Destinazione: ${destinazione}\n\n${descrizione}`
        // emailUtente rimosso, lo gestisce backend
      });

      const richiestaId = res.data.id;
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
