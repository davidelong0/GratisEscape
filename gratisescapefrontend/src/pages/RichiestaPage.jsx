import React, { useState } from 'react';
import RichiestaChatForm from '../components/richieste/RichiestaChatForm';

const RichiestaPage = () => {
  // Non serve più scegliere tipo, mostriamo direttamente il form chat
  return (
    <div className="container mt-4">
      <RichiestaChatForm />
    </div>
  );
};

export default RichiestaPage;


