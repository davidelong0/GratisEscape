import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFavourite } from '../redux/actions/authActions'
import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FavouritesPage = () => {
  const favourites = useSelector(state => state.auth.favourites || [])
  const dispatch = useDispatch()

  const handleRemove = (id) => {
    dispatch(removeFavourite(id))
  }

  return (
    <div className="container mt-5">
      <h2>I tuoi viaggi preferiti</h2>
      {favourites.length === 0 ? <p>Non hai ancora salvato viaggi nei preferiti.</p> : (
        favourites.map(v => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
          >
<Card>
  <Card.Img variant="top" src={v.urlImmagine} alt={v.nome} />
  <Card.Body>
    <Card.Title>{v.nome}</Card.Title>
    <Card.Text>
      <strong>Destinazione:</strong> {v.destinazione}<br />
      <strong>Prezzo:</strong> €{v.prezzo}
    </Card.Text>
    <Link to={`/viaggi/${v.id}`} className="btn btn-primary me-2">Dettagli</Link>
    <Button variant="outline-danger" onClick={() => handleRemove(v.id)}>
      Rimuovi dai preferiti
    </Button>
  </Card.Body>
</Card>

          </motion.div>
        ))
      )}
    </div>
  )
}

export default FavouritesPage