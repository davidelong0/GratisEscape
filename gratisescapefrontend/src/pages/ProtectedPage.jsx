import React from 'react'

const ProtectedPage = () => {
  return (
    <div className="container mt-5">
      <h2>Benvenuto in un'area riservata</h2>
      <p>Solo gli utenti autenticati possono vedere questa pagina.</p>
    </div>
  )
}

export default ProtectedPage