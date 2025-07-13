import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { LOGIN_SUCCESS } from '../../redux/actions/authActions'

const GoogleSuccessPage = () => {
  const [params] = useSearchParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const nome = params.get('nome')
    const cognome = params.get('cognome')
    const email = params.get('email')
    const ruolo = params.get('ruolo')

    if (token && email) {
      localStorage.setItem('token', token)
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token,
          user: {
            nome,
            cognome,
            email,
            ruolo,
          },
        },
      })
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [params, dispatch, navigate])

  return (
    <div className="container mt-5">
      <h2>Login con Google in corso...</h2>
    </div>
  )
}

export default GoogleSuccessPage
