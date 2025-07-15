import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/actions/authActions'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(login(form, navigate))
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4" style={{ fontFamily: "'Georgia', serif", color: '#5a4b27', fontWeight: 700 }}>
        Login
      </h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="form-control mb-3"
          required
          style={{ fontFamily: "'Georgia', serif" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="form-control mb-3"
          required
          style={{ fontFamily: "'Georgia', serif" }}
        />
       <button type="submit" className="btn btn-textcolor mb-3">
  Accedi
</button>


        <div className="text-center mb-3">
          <Link to="/forgot-password" className="forgot-password-link">
            Hai dimenticato la password?
          </Link>
        </div>

        <a
          href="http://localhost:8080/oauth2/authorization/google"
          className="btn btn-google w-100"
          style={{ fontWeight: 600 }}
        >
          Accedi con Google
        </a>
      </form>
    </div>
  )
}

export default Login
