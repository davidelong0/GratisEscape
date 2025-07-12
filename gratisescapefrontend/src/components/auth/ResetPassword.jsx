import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetPassword } from '../../redux/actions/authActions'
import { useSearchParams } from 'react-router-dom'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const [params] = useSearchParams()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(resetPassword(params.get('token'), password))
  }

  return (
    <div className="container mt-5">
      <h2>Imposta Nuova Password</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="password" placeholder="Nuova Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-success">Conferma</button>
      </form>
    </div>
  )
}

export default ResetPassword