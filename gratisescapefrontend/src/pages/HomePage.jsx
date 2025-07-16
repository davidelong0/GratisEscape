import React from 'react';
import PoeticText from '../components/PoeticText';
import ViaggiPerCategoria from '../components/home/ViaggiPerCategoria';

const HomePage = () => {
  return (
    <div className="container mt-4 homepage-container">
      <PoeticText text="Il mondo è un libro e chi non viaggia ne legge solo una pagina." />

      <ViaggiPerCategoria categoria="SINGOLO" titolo="Viaggi Singoli" maxItems={4} />
      <ViaggiPerCategoria categoria="LAST_MINUTE" titolo="Offerte Last Minute" maxItems={4} />
      <ViaggiPerCategoria categoria="LUXURY" titolo="Viaggi Luxury" maxItems={4} />
      <ViaggiPerCategoria categoria="CROCIERA" titolo="Crociere da sogno" maxItems={4} />
      <ViaggiPerCategoria categoria="GRUPPO" titolo="Viaggi di Gruppo" maxItems={4} />
      <ViaggiPerCategoria categoria="PACCHETTO" titolo="Pacchetti esclusivi" maxItems={4} />
    </div>
  );
};

export default HomePage;

