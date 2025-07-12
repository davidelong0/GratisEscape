import React from 'react'
import ViaggiPerCategoria from '../components/home/ViaggiPerCategoria'

const HomePage = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Benvenuto su GratisEscape!</h2>
      <ViaggiPerCategoria categoria="LAST_MINUTE" titolo="Offerte Last Minute" />
      <ViaggiPerCategoria categoria="LUXURY" titolo="Viaggi Luxury" />
      <ViaggiPerCategoria categoria="CROCIERA" titolo="Crociere da sogno" />
      <ViaggiPerCategoria categoria="GRUPPO" titolo="Viaggi di Gruppo" />
      <ViaggiPerCategoria categoria="PACCHETTO" titolo="Pacchetti esclusivi" />
    </div>
  )
}

export default HomePage
