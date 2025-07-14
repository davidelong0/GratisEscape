import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logout effettuato");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <Link className="navbar-brand" to="/">
        GratisEscape
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/viaggi">
              Viaggi
            </Link>
          </li>

          {user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/richiesta">
                  Richiesta
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/preferiti">
                  Preferiti
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profilo">
                  Profilo
                </Link>
              </li>
            </>
          )}

          {user?.ruolo === 'ADMIN' && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/viaggi">
                  Gestione Viaggi
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/richieste">
                  Gestione Richieste
                </Link>
              </li>
            </>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          {!user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Registrati
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

