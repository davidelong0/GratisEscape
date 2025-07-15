import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useSelector } from 'react-redux';

const RichiestaEmailForm = () => {
  const [destinazione, setDestinazione] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const { user } = useSelector(state => state.auth);

  const handleInvioEmail = async (e) => {
    e.preventDefault();

    if (!user || !user.email) {
      toast.error("Utente non autenticato!");
      return;
    }

    try {
      await api.post('/richieste', {
        testoRichiesta: `Destinazione: ${destinazione}\n\n${descrizione}`
        // emailUtente rimosso, lo gestisce backend
      });

      toast.success("Richiesta inviata con successo!");
      setDestinazione('');
      setDescrizione('');
    } catch (error) {
      toast.error("Errore: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleInvioEmail}>
        <input
          className="form-control"
          placeholder="Destinazione"
          value={destinazione}
          onChange={(e) => setDestinazione(e.target.value)}
          required
        />
        <textarea
          className="form-control mt-2"
          rows={4}
          placeholder="Descrizione"
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
          required
        />
        <button className="btn btn-secondary mt-3" type="submit">
          Invia via email
        </button>
      </form>
    </div>
  );
};

export default RichiestaEmailForm;
