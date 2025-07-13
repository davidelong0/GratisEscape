// src/components/auth/ChangePasswordFirst.jsx
import React, { useState } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const ChangePasswordFirst = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/change-password-first', { oldPassword, newPassword })
      toast.success('Password cambiata! Ora puoi fare il login.')
      navigate('/login')
    } catch {
      toast.error('Errore durante il cambio password.')
    }
  }

  return (
    <div className="container mt-5">
      <h2>Cambia la Password al Primo Accesso</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Vecchia Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Nuova Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button className="btn btn-warning">Conferma</button>
      </form>
    </div>
  )
}

export default ChangePasswordFirst
