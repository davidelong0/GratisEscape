import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const ViaggiPerCategoria = ({ categoria, titolo, maxItems = 4 }) => {
  const [viaggi, setViaggi] = useState([])

  useEffect(() => {
    api.get(`/viaggi/categoria/${categoria}`)
      .then(res => setViaggi(res.data.slice(0, maxItems)))
  }, [categoria, maxItems])

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-gold">{titolo}</h4>
        <Link
          to={`/viaggi?categoria=${categoria}`}
          className="btn btn-outline-gold btn-sm"
        >
          Vedi tutti
        </Link>
      </div>
      <div className="row">
        {viaggi.map(v => (
          <div className="col-6 col-md-3 mb-3" key={v.id}>
            <div className="card h-100 shadow-sm rounded">
              <img src={v.urlImmagine} className="card-img-top" alt={v.nome} style={{ objectFit: 'cover', height: '180px' }} />
              <div className="card-body">
                <h5 className="card-title text-truncate text-gold">{v.nome}</h5>
                <p className="card-text text-muted">{v.destinazione}</p>
                <Link to={`/viaggi/${v.id}`} className="btn btn-gold btn-sm">
                  Dettagli
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViaggiPerCategoria
