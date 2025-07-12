import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { changePassword } from '../../redux/actions/authActions'

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(changePassword(oldPassword, newPassword))
  }

  return (
    <div className="container mt-5">
      <h2>Cambia Password</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="password" placeholder="Vecchia Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
        <input className="form-control mb-2" type="password" placeholder="Nuova Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <button className="btn btn-info">Aggiorna</button>
      </form>
    </div>
  )
}

export default ChangePassword