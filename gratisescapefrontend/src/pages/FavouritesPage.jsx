import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavourite } from '../redux/actions/authActions';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FavouritesPage = () => {
  const favourites = useSelector(state => state.auth.favourites || []);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(removeFavourite(id));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-gold mb-4">I tuoi viaggi preferiti</h2>

      {favourites.length === 0 ? (
        <p className="text-muted">Non hai ancora salvato viaggi nei preferiti.</p>
      ) : (
        <div className="row g-4">
          {favourites.map(v => (
            <motion.div
              key={v.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-100 shadow-sm rounded">
                <Card.Img
                  variant="top"
                  src={v.urlImmagine}
                  alt={v.nome}
                  style={{ objectFit: 'cover', height: '180px' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate text-gold">{v.nome}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">
                    <strong>Destinazione:</strong> {v.destinazione}<br />
                    <strong>Prezzo:</strong> €{v.prezzo}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to={`/viaggi/${v.id}`} className="btn btn-gold btn-sm">
                      Dettagli
                    </Link>
                    <Button
                      variant="outline-gold"
                      size="sm"
                      onClick={() => handleRemove(v.id)}
                    >
                      Rimuovi
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
