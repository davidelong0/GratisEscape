import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/actions/authActions'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // ✅ Mostra messaggio se l'email è stata confermata
  useEffect(() => {
    if (searchParams.get('confirmed') === 'true') {
      toast.success('Email confermata con successo! Ora puoi effettuare il login.')
    }

    if (searchParams.get('alreadyConfirmed') === 'true') {
      toast.info('Email già confermata. Effettua il login.')
    }

    if (searchParams.get('errore') === 'true') {
      toast.error('Errore durante la conferma email.')
    }
  }, [searchParams])

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }, navigate))
  }

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          className="form-control mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100">Accedi</button>
        <a
          href="http://localhost:8080/oauth2/authorization/google"
          className="btn btn-outline-danger w-100 mt-3"
        >
          Accedi con Google
        </a>
      </form>
    </div>
  )
}

export default Login
