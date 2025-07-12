import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const ViaggiPerCategoria = ({ categoria, titolo }) => {
  const [viaggi, setViaggi] = useState([])

  useEffect(() => {
    api.get(`/viaggi/categoria/${categoria}`)
      .then(res => setViaggi(res.data.slice(0, 3)))
  }, [categoria])

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{titolo}</h4>
        <Link to={`/viaggi?categoria=${categoria}`} className="btn btn-outline-primary btn-sm">
          Vedi tutti
        </Link>
      </div>
      <div className="row">
        {viaggi.map(v => (
          <div className="col-md-4 mb-3" key={v.id}>
            <div className="card h-100">
              <img src={v.urlImmagine} className="card-img-top" alt={v.nome} />
              <div className="card-body">
                <h5 className="card-title">{v.nome}</h5>
                <p className="card-text">{v.destinazione}</p>
                <Link to={`/viaggi/${v.id}`} className="btn btn-sm btn-primary">Dettagli</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViaggiPerCategoria