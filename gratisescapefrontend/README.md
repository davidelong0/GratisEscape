---

### `README.md` — **FRONTEND** (React)

````markdown
# GratisEscape - Frontend

Frontend del progetto **GratisEscape**, un'applicazione per agenzia di viaggi, sviluppata con React e Bootstrap. Permette la navigazione pubblica, la gestione autenticazione e interazione chat tra utenti e admin.

## Tecnologie usate

- **React 18+**
- **React Router DOM**
- **Redux Toolkit** per stato globale (notifiche, autenticazione)
- **Axios** per richieste HTTP
- **Framer Motion** per animazioni
- **Bootstrap 5**
- **SockJS + STOMP** per WebSocket client
- **Cloudinary** per immagini (upload gestito lato backend)

## Funzionalità utente

- Registrazione, login con JWT
- Login con Google OAuth2
- Reset e cambio password
- Visualizzazione viaggi per categoria
- Inoltro richieste all'agenzia
- Visualizzazione stato risposte
- Chat in tempo reale con badge notifiche

## Funzionalità admin

- Gestione viaggi (crea, modifica, elimina)
- Visualizzazione richieste utenti
- Risposte tramite chat e via email
- Visualizzazione stato lettura messaggi
- Cambio password al primo accesso forzato

## WebSocket e Notifiche

- Notifiche WebSocket con badge rosso per:
  - Nuovi messaggi non letti
  - Nuove richieste in arrivo
- Persistenza notifiche via Redux + localStorage

## Avvio sviluppo

1. Installa le dipendenze:

```bash
npm install
```
````
