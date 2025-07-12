import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { LOGIN_SUCCESS } from '../../redux/actions/authActions'

const GoogleSuccessPage = () => {
  const [params] = useSearchParams()
  const token = params.get('token')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      const user = { email: 'Google User' } // placeholder, puoi estrarre dal backend se serve
      localStorage.setItem('token', token)
      dispatch({ type: LOGIN_SUCCESS, payload: { user, token } })
      navigate('/')
    }
  }, [token])

  return (
    <div className="container mt-5">
      <h2>Login con Google completato!</h2>
    </div>
  )
}

export default GoogleSuccessPage