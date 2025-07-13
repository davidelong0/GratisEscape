import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/actions/authActions'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { token, user } = useSelector(state => state.auth)
  const isAdmin = user?.ruolo === "ADMIN"

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">GratisEscape</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {token && !isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/viaggi">Viaggi</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/richiesta">Richiesta personalizzata</Link>
                </li>
              </>
            )}

            {token && isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/viaggi">Gestione Viaggi</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/richieste">Gestione Richieste</Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registrati</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2 d-flex align-items-center">
                  <span className="nav-link disabled text-muted">
                    {user?.nome} {user?.cognome} ({user?.ruolo})
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
