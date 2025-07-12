import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link, useSearchParams } from 'react-router-dom'

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
    fetchViaggi()
  }

  const handleFilter = (e) => {
    setQuery('')
    setCategoria(e.target.value)
    setSearchParams({ categoria: e.target.value })
    fetchViaggi()
  }

  return (
    <div className="container mt-5">
      <h2>Esplora i nostri viaggi</h2>
      <form onSubmit={handleSearch} className="row mb-4">
        <div className="col-md-6">
          <input
            className="form-control"
            type="text"
            placeholder="Cerca per nome o destinazione"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={categoria} onChange={handleFilter}>
            <option value="">Tutte le categorie</option>
            <option value="SINGOLO">Singolo</option>
            <option value="GRUPPO">Gruppo</option>
            <option value="PACCHETTO">Pacchetto</option>
            <option value="LAST_MINUTE">Last Minute</option>
            <option value="CROCIERA">Crociera</option>
            <option value="LUXURY">Luxury</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100">Cerca</button>
        </div>
      </form>

      <div className="row">
        {viaggi.length > 0 ? viaggi.map(v => (
          <div className="col-md-4 mb-4" key={v.id}>
            <div className="card h-100">
              <img src={v.urlImmagine} className="card-img-top" alt={v.nome} />
              <div className="card-body">
                <h5 className="card-title">{v.nome}</h5>
                <p className="card-text">{v.destinazione}</p>
                <Link to={`/viaggi/${v.id}`} className="btn btn-primary">Dettagli</Link>
              </div>
            </div>
          </div>
        )) : <p>Nessun viaggio trovato.</p>}
      </div>
    </div>
  )
}

export default ViaggiPage