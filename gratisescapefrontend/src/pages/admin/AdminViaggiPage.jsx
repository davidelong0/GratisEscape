import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'

const initialForm = {
  nome: '',
  descrizione: '',
  destinazione: '',
  categoria: 'SINGOLO',
  prezzo: '',
  file: null
}

const AdminViaggiPage = () => {
  const [viaggi, setViaggi] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)

  const loadViaggi = () => {
    api.get('/viaggi')
      .then(res => setViaggi(res.data))
      .catch(() => toast.error('Errore nel caricamento viaggi'))
  }

  useEffect(() => {
    loadViaggi()
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value)
    })

    const request = editingId
      ? api.put(`/viaggi/${editingId}`, formData)
      : api.post('/viaggi', formData)

    request
      .then(() => {
        toast.success(`Viaggio ${editingId ? 'modificato' : 'creato'} con successo`)
        setForm(initialForm)
        setEditingId(null)
        loadViaggi()
      })
      .catch(() => toast.error('Errore salvataggio viaggio'))
  }

  const handleEdit = (v) => {
    setForm({
      nome: v.nome,
      descrizione: v.descrizione,
      destinazione: v.destinazione,
      categoria: v.categoria,
      prezzo: v.prezzo,
      file: null
    })
    setEditingId(v.id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo viaggio?')) {
      api.delete(`/viaggi/${id}`)
        .then(() => {
          toast.success('Viaggio eliminato')
          loadViaggi()
        })
        .catch(() => toast.error('Errore eliminazione'))
    }
  }

  return (
    <div className="container mt-5">
      <h2>Gestione Viaggi (Admin)</h2>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="row">
          <div className="col-md-4 mb-2">
            <input className="form-control" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
          </div>
          <div className="col-md-4 mb-2">
            <input className="form-control" name="destinazione" placeholder="Destinazione" value={form.destinazione} onChange={handleChange} required />
          </div>
          <div className="col-md-4 mb-2">
            <input className="form-control" name="prezzo" type="number" placeholder="Prezzo" value={form.prezzo} onChange={handleChange} required />
          </div>
          <div className="col-md-12 mb-2">
            <textarea className="form-control" name="descrizione" placeholder="Descrizione" value={form.descrizione} onChange={handleChange} rows={2} required />
          </div>
          <div className="col-md-4 mb-2">
            <select className="form-select" name="categoria" value={form.categoria} onChange={handleChange}>
              <option value="SINGOLO">Singolo</option>
              <option value="GRUPPO">Gruppo</option>
              <option value="PACCHETTO">Pacchetto</option>
              <option value="LAST_MINUTE">Last Minute</option>
              <option value="CROCIERA">Crociera</option>
              <option value="LUXURY">Luxury</option>
            </select>
          </div>
          <div className="col-md-4 mb-2">
            <input className="form-control" type="file" name="file" onChange={handleChange} accept="image/*" />
          </div>
          <div className="col-md-4 mb-2">
            <button type="submit" className="btn-textcolor w-100">
              {editingId ? 'Salva Modifiche' : 'Crea Viaggio'}
            </button>
          </div>
        </div>
      </form>

      <h4>Lista Viaggi</h4>
      <div className="row">
        {viaggi.map(v => (
          <div key={v.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={v.urlImmagine} className="card-img-top" alt={v.nome} />
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">{v.nome}</h5>
                  <p className="card-text">{v.destinazione} - €{v.prezzo}</p>
                  <p className="card-text"><small>{v.categoria}</small></p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(v)}
                    className="btn-modify btn-sm me-2"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="btn-delete btn-sm"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminViaggiPage
