import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const ViaggiPage = () => {
  const [viaggi, setViaggi] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || '')

  const fetchViaggi = () => {
    let endpoint = '/viaggi'
    if (query) endpoint = `/viaggi/search?q=${query}`
    else if (categoria) endpoint = `/viaggi/categoria/${categoria}`

    api.get(endpoint)
      .then(res => setViaggi(res.data))
      .catch(err => console.error('Errore caricamento viaggi', err))
  }

  useEffect(() => {
    fetchViaggi()
  }, [query, categoria])

  const handleSearch = (e) => {
    e.preventDefault()
    setCategoria('')
    setSearchParams({ q: query })
  }

  const handleFilter = (e) => {
    setQuery('')
    setCategoria(e.target.value)
    setSearchParams({ categoria: e.target.value })
  }

  return (
    <div className="container mt-5">
      <h2 className="text-gold mb-4">Esplora i nostri viaggi</h2>

      <form onSubmit={handleSearch} className="row mb-4 g-3 align-items-center">
        <div className="col-md-6">
          <input
            className="form-control"
            type="search"
            placeholder="Cerca per nome o destinazione"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cerca viaggi"
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={categoria} onChange={handleFilter} aria-label="Filtro categoria">
            <option value="">Tutte le categorie</option>
            <option value="SINGOLO">Singolo</option>
            <option value="GRUPPO">Gruppo</option>
            <option value="PACCHETTO">Pacchetto</option>
            <option value="LAST_MINUTE">Last Minute</option>
            <option value="CROCIERA">Crociera</option>
            <option value="LUXURY">Luxury</option>
          </select>
        </div>
        <div className="col-md-3 d-grid">
          <button type="submit" className="btn btn-outline-gold">
            Cerca
          </button>
        </div>
      </form>

      {viaggi.length === 0 ? (
        <p>Nessun viaggio trovato.</p>
      ) : (
        <div className="row g-4">
          {viaggi.map(v => (
            <motion.div
              key={v.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card h-100 shadow-sm rounded">
                <img
                  src={v.urlImmagine}
                  className="card-img-top"
                  alt={v.nome}
                  style={{ objectFit: 'cover', height: '180px' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate text-gold">{v.nome}</h5>
                  <p className="card-text text-muted flex-grow-1">{v.destinazione}</p>
                  <Link to={`/viaggi/${v.id}`} className="btn btn-gold mt-auto">
                    Dettagli
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViaggiPage
