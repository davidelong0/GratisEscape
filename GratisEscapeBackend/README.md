# GratisEscape - Backend

Questo è il backend del progetto **GratisEscape**, un gestionale per un'agenzia di viaggi. Scritto in Java con Spring Boot, fornisce API REST, sicurezza, autenticazione (classica e OAuth2), e WebSocket per chat in tempo reale.

##  Tecnologie usate

- **Spring Boot 3.5.3**
- **Spring Security (JWT + OAuth2 Google)**
- **Spring Data JPA** con PostgreSQL
- **WebSocket con STOMP + SockJS**
- **JavaMailSender** per invio email
- **Cloudinary** per upload immagini
- **Lombok** per ridurre boilerplate
- **JUnit + MockMvc** per test
- **Maven** come build system

##  Logiche implementate

###  Autenticazione
- Login classico (email/password) con token JWT
- Registrazione con conferma via email
- Reset password via email con token temporaneo
- Login con Google OAuth2
- Gestione cambio password forzato per admin al primo accesso

###  Ruoli e autorizzazioni
- `ADMIN`: accesso completo (gestione viaggi, richieste, utenti)
- `UTENTE`: può visualizzare viaggi e inviare richieste

###  Sistema Chat
- Chat utente ↔ admin per ogni richiesta
- WebSocket STOMP su `/ws-chat`, canale `/topic/public`
- Persistenza messaggi + controllo lettura (`lettoDalDestinatario`)
- Notifiche visualizzate solo se admin/utente non ha ancora aperto la richiesta/chat

###  Email integrate
- Invio link conferma email e reset password
- Invio risposta alla richiesta via email

###  Viaggi
- CRUD viaggi solo per admin
- Upload immagini con Cloudinary
- Filtraggio per categoria, ricerca per nome

###  Test
- Test con `MockMvc` per autenticazione, reset password

##  Configurazioni

`.env.properties`:
```properties
postgresql.password=...
cloud_name=...
api_key=...
api_secret=...
gmail.from=...
gmail.password=...
google.client-id=...
google.client-secret=...
