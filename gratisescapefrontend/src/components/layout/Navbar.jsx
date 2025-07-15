import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'react-bootstrap-icons';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showBackArrow, setShowBackArrow] = useState(false);
  const isAdmin = user?.ruolo === 'ADMIN';

  useEffect(() => {
    setShowBackArrow(location.pathname !== '/');
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logout effettuato");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      {showBackArrow && (
        <button
          className="btn btn-outline-light me-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
        </button>
      )}
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

          {user && !isAdmin && (
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

          {isAdmin && (
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

        {user && (
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item text-white me-3">
              {isAdmin ? "Admin" : `${user.nome} ${user.cognome}`}
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        )}

        {!user && (
          <ul className="navbar-nav ms-auto">
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
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


