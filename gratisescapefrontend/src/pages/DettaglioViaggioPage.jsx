import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { useDispatch, useSelector } from 'react-redux'
import { addFavourite, removeFavourite } from '../redux/actions/authActions'
import { Button } from 'react-bootstrap'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

const DettaglioViaggioPage = () => {
  const { id } = useParams()
  const [viaggio, setViaggio] = useState(null)

  const dispatch = useDispatch()
  const favourites = useSelector((state) => state.auth.favourites)
  const isLoggedIn = useSelector((state) => !!state.auth.user)  // verifica login

  const isFavourite = favourites.some((f) => f.id === parseInt(id))

  useEffect(() => {
    api.get(`/viaggi/${id}`)
      .then(res => setViaggio(res.data))
      .catch(err => console.error('Errore caricamento dettaglio', err))
  }, [id])

  const handleToggleFavourite = () => {
    if (isFavourite) {
      dispatch(removeFavourite(viaggio.id))
    } else {
      dispatch(addFavourite(viaggio))
    }
  }

  if (!viaggio) return <div className="container mt-5">Caricamento...</div>

  return (
    <div className="container mt-5">
      <h2 className="mb-3 text-gold">{viaggio.nome}</h2>
      <img
        src={viaggio.urlImmagine}
        className="img-fluid mb-3 rounded shadow"
        alt={viaggio.nome}
        style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
      />
      
      <p><strong>Destinazione:</strong> {viaggio.destinazione}</p>
      <p><strong>Descrizione:</strong> {viaggio.descrizione}</p>
      <p><strong>Prezzo:</strong> €{viaggio.prezzo}</p>

      {isLoggedIn && (
        <Button
          className="btn-outline-gold d-flex align-items-center gap-2"
          onClick={handleToggleFavourite}
        >
          {isFavourite ? <><FaHeart /> Rimuovi dai preferiti</> : <><FaRegHeart /> Aggiungi ai preferiti</>}
        </Button>
      )}
    </div>
  )
}

export default DettaglioViaggioPage
