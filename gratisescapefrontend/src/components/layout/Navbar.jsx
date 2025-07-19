import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';
import {
  setNewMessage,
  setNotificaRichiesta,
  setNotifichePerRichieste
} from '../../redux/notificationSlice';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';
import api from '../../services/api';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const hasNewMessage = useSelector(state => state.notification.hasNewMessage);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showBackArrow, setShowBackArrow] = useState(false);
  const isAdmin = user?.ruolo === 'ADMIN';

  useEffect(() => {
    setShowBackArrow(location.pathname !== '/');
  }, [location]);

  useEffect(() => {
    const checkUnread = async () => {
      if (!user) return;
      try {
        const richieste = await api.get(user.ruolo === 'ADMIN' ? '/richieste' : '/richieste/mie');
        const perRichiestaMap = {};
        const promises = richieste.data.map(async (r) => {
          const res = await api.get(`/api/chat/${r.id}/unread?mittente=${user.ruolo}`);
          perRichiestaMap[r.id] = res.data.length > 0;
          return res.data.length > 0;
        });
        const unreadFlags = await Promise.all(promises);
        const anyUnread = unreadFlags.includes(true);
        dispatch(setNewMessage(anyUnread));
        dispatch(setNotifichePerRichieste(perRichiestaMap));
      } catch (err) {
        console.warn("Errore durante il recupero delle notifiche non lette");
      }
    };
    checkUnread();
  }, [user, dispatch]);

  useEffect(() => {
    if (!user) return;

    const socket = new SockJS('http://localhost:8080/ws-chat');
    const stomp = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stomp.subscribe('/topic/public', (msg) => {
          const newMsg = JSON.parse(msg.body);
          const isFromMe =
            (user.ruolo === 'ADMIN' && newMsg.mittente === 'ADMIN') ||
            (user.ruolo !== 'ADMIN' && newMsg.mittente === 'USER');

          if (!isFromMe) {
            if (
              (user.ruolo === 'ADMIN' && newMsg.emailDestinatario === 'ADMIN') ||
              (user.ruolo !== 'ADMIN' && newMsg.emailDestinatario === user.email)
            ) {
              dispatch(setNewMessage(true));
              dispatch(setNotificaRichiesta({ richiestaId: newMsg.richiestaId, value: true }));
            }
          }
        });
      },
      onStompError: () => {
        console.error('Errore WebSocket nella navbar');
      }
    });

    stomp.activate();

    return () => {
      if (stomp.connected) stomp.deactivate();
    };
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logout effettuato");
    navigate("/login");
  };

  const handleCampanellaClick = async () => {
    dispatch(setNewMessage(false));
    try {
      const richieste = await api.get(user.ruolo === 'ADMIN' ? '/richieste' : '/richieste/mie');
      await Promise.all(
        richieste.data.map((r) =>
          api.put(`/api/chat/${r.id}/mark-read?mittente=${user.ruolo}`)
        )
      );
    } catch (err) {
      console.warn("Errore nel marcare messaggi come letti");
    }

    if (isAdmin) {
      navigate('/admin/richieste');
    } else {
      navigate('/profilo');
    }
  };

  const linkVariants = {
    initial: { opacity: 0.8 },
    hover: { opacity: 1, scale: 1.05, color: "#a67c52", transition: { duration: 0.3 } }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light px-4"
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
            marginRight: '3rem'
          }}
        >
          GratisEscape
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!isAdmin && user && (
              <>
                <motion.li className="nav-item" initial="initial" whileHover="hover" variants={linkVariants}>
                  <Link className="nav-link text-white" to="/viaggi">Viaggi</Link>
                </motion.li>
                <motion.li className="nav-item" initial="initial" whileHover="hover" variants={linkVariants}>
                  <Link className="nav-link text-white" to="/richiesta">Richiesta</Link>
                </motion.li>
                <motion.li className="nav-item" initial="initial" whileHover="hover" variants={linkVariants}>
                  <Link className="nav-link text-white" to="/preferiti">Preferiti</Link>
                </motion.li>
                <motion.li className="nav-item" initial="initial" whileHover="hover" variants={linkVariants}>
                  <Link className="nav-link text-white" to="/profilo">Profilo</Link>
                </motion.li>
              </>
            )}
            {isAdmin && (
              <>
                <motion.li className="nav-item" initial="initial" whileHover="hover" variants={linkVariants}>
                  <Link className="nav-link text-white" to="/admin/viaggi">Gestione Viaggi</Link>
                </motion.li>
                <motion.li className="nav-item" initial="initial" whileHover="hover" variants={linkVariants}>
                  <Link className="nav-link text-white" to="/admin/richieste">Gestione Richieste</Link>
                </motion.li>
              </>
            )}
          </ul>

          {user ? (
            <ul className="navbar-nav ms-auto align-items-center">
              <motion.li
                className="nav-item text-white me-3 position-relative"
                initial="initial"
                whileHover="hover"
                variants={linkVariants}
                style={{ fontWeight: '700', cursor: 'pointer' }}
                onClick={handleCampanellaClick}
              >
                🔔
                {hasNewMessage && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                    width: '10px',
                    height: '10px',
                    display: 'inline-block'
                  }} />
                )}
              </motion.li>

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
                <button className="btn btn-outline-gold" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto">
              <motion.li className="nav-item" initial="initial" whileHover="hover" variants={linkVariants}>
                <Link className="nav-link text-white" to="/login">Login</Link>
              </motion.li>
              <motion.li className="nav-item" initial="initial" whileHover="hover" variants={linkVariants}>
                <Link className="nav-link text-white" to="/register">Registrati</Link>
              </motion.li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
