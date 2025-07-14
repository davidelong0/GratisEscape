import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-toastify';

const ProfiloUtentePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [richieste, setRichieste] = useState([]);

  useEffect(() => {
    if (!user) navigate('/login');
    else fetchRichiesteUtente();
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

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Profilo Utente</h2>
      <p><strong>Nome:</strong> {user?.nome}</p>
      <p><strong>Email:</strong> {user?.email}</p>

      <hr className="my-4" />

      <h4>Le mie richieste personalizzate</h4>
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
                <Card.Title>{`Richiesta #${r.id}`}</Card.Title>
                <Card.Text>{r.testoRichiesta}</Card.Text>
                <Link to={`/chat/${r.id}`} className="btn btn-outline-primary btn-sm">
                  Apri chat
                </Link>
              </Card.Body>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default ProfiloUtentePage;

