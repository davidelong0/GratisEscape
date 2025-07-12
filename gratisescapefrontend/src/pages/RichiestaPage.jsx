import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const RichiestaPage = () => {
  const { user } = useSelector(state => state.auth)
  const [testo, setTesto] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!testo.trim()) {
      toast.warning('Inserisci una richiesta valida')
      return
    }

    try {
      const res = await api.post('/richieste', {
        testoRichiesta: testo,
        emailUtente: user.email,
      })
      toast.success('Richiesta inviata')
      navigate(`/chat/${res.data.id}`) // 👈 Vai alla chat direttamente
    } catch {
      toast.error('Errore invio richiesta')
    }
  }

  return (
    <div className="container mt-5">
      <h3>Richiesta personalizzata</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control mb-3"
          rows={5}
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder="Scrivi la tua richiesta personalizzata..."
        />
        <button className="btn btn-primary">Invia Richiesta</button>
      </form>
    </div>
  )
}

export default RichiestaPage
