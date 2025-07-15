import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
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

  const linkVariants = {
    initial: { opacity: 0.8 },
    hover: { opacity: 1, scale: 1.05, color: "#a67c52", transition: { duration: 0.3 } }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light px-4"
      style={{
        background: "linear-gradient(90deg,rgb(127, 118, 99) 0%, #efe9dd 100%)",
        boxShadow: "0 3px 6px rgba(118, 90, 41, 0.12)",
        borderBottom: "1px solid #d9d1bc",
        minHeight: '56px',
        alignItems: 'center',
      }}
    >
      <div className="container-fluid">
        {showBackArrow && (
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => navigate(-1)}
            aria-label="Torna indietro"
            style={{ padding: '0.25rem 0.5rem', borderColor: '#5a4b27' }}
          >
            <ArrowLeft style={{ fontSize: '1rem', color: '#5a4b27' }} />
          </button>
        )}

        <Link
          className="navbar-brand"
          to="/"
          style={{
            fontFamily: "'Georgia', serif",
            fontWeight: 900,
            fontSize: '1.8rem',
            background: "linear-gradient(270deg, #b0882f, #e3c26f, #a67c52, #f5e79e)",
            backgroundSize: "600% 600%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            animation: "goldGradientShift 8s ease infinite",
            userSelect: "none",
            margin: "0 auto",
            textShadow: "1px 1px 2px #fdf6e3",
            marginRight: '3rem'  // <-- aggiunto margine a destra per spazio
          }}
        >
          GratisEscape
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!isAdmin && user && (
              <motion.li
                className="nav-item"
                initial="initial"
                whileHover="hover"
                variants={linkVariants}
              >
                <Link className="nav-link text-white" to="/viaggi">
                  Viaggi
                </Link>
              </motion.li>
            )}

            {!isAdmin && user && (
              <>
                <motion.li
                  className="nav-item"
                  initial="initial"
                  whileHover="hover"
                  variants={linkVariants}
                >
                  <Link className="nav-link text-white" to="/richiesta">
                    Richiesta
                  </Link>
                </motion.li>
                <motion.li
                  className="nav-item"
                  initial="initial"
                  whileHover="hover"
                  variants={linkVariants}
                >
                  <Link className="nav-link text-white" to="/preferiti">
                    Preferiti
                  </Link>
                </motion.li>
                <motion.li
                  className="nav-item"
                  initial="initial"
                  whileHover="hover"
                  variants={linkVariants}
                >
                  <Link className="nav-link text-white" to="/profilo">
                    Profilo
                  </Link>
                </motion.li>
              </>
            )}

            {isAdmin && (
              <>
                <motion.li
                  className="nav-item"
                  initial="initial"
                  whileHover="hover"
                  variants={linkVariants}
                >
                  <Link className="nav-link text-white" to="/admin/viaggi">
                    Gestione Viaggi
                  </Link>
                </motion.li>
                <motion.li
                  className="nav-item"
                  initial="initial"
                  whileHover="hover"
                  variants={linkVariants}
                >
                  <Link className="nav-link text-white" to="/admin/richieste">
                    Gestione Richieste
                  </Link>
                </motion.li>
              </>
            )}
          </ul>

          {user ? (
            <ul className="navbar-nav ms-auto align-items-center">
              <motion.li
                className="nav-item text-white me-3"
                initial="initial"
                whileHover="hover"
                variants={linkVariants}
                style={{ fontWeight: '700' }}
              >
                {isAdmin ? "Admin" : `${user.nome} ${user.cognome}`}
              </motion.li>
              <li className="nav-item">
                <button className="btn btn-outline-gold" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto">
              <motion.li
                className="nav-item"
                initial="initial"
                whileHover="hover"
                variants={linkVariants}
              >
                <Link className="nav-link text-white" to="/login">
                  Login
                </Link>
              </motion.li>
              <motion.li
                className="nav-item"
                initial="initial"
                whileHover="hover"
                variants={linkVariants}
              >
                <Link className="nav-link text-white" to="/register">
                  Registrati
                </Link>
              </motion.li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
