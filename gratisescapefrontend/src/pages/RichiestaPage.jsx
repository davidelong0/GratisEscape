import React, { useState } from 'react';
import RichiestaChatForm from '../components/richieste/RichiestaChatForm';
import RichiestaEmailForm from '../components/richieste/RichiestaEmailForm';

const RichiestaPage = () => {
  const [tipo, setTipo] = useState(null);

  return (
    <div className="container mt-4">
      {!tipo && (
        <>
          <h3 className="mb-3">Come vuoi inviare la tua richiesta?</h3>
          <div className="d-flex gap-3">
            <button className="btn btn-primary" onClick={() => setTipo("chat")}>
              <i className="bi bi-chat-dots-fill me-1"></i> Chat
            </button>
            <button className="btn btn-secondary" onClick={() => setTipo("email")}>
              <i className="bi bi-envelope-fill me-1"></i> Email
            </button>
          </div>
        </>
      )}
      {tipo === "chat" && <RichiestaChatForm />}
      {tipo === "email" && <RichiestaEmailForm />}
    </div>
  );
};

export default RichiestaPage;

