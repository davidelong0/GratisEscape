import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { forgotPassword } from '../../redux/actions/authActions'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(forgotPassword(email))
  }

  return (
    <div className="container mt-5">
      <h2>Recupera Password</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button className="btn btn-warning">Invia link reset</button>
      </form>
    </div>
  )
}

export default ForgotPassword