import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StarFill, Instagram, Facebook } from 'react-bootstrap-icons';
import PoeticText from '../components/PoeticText';


const recensioni = [
  {
    nome: 'Giulia R.',
    testo: 'Esperienza incredibile in Islanda! Guide professionali e organizzazione impeccabile.',
    rating: 5,
  },
  {
    nome: 'Luca e Marta',
    testo: 'Abbiamo viaggiato con GratisEscape in Giappone, tutto perfetto! Super consigliato.',
    rating: 4,
  },
  {
    nome: 'Federica P.',
    testo: 'Crociera da sogno, ci siamo sentiti coccolati dall’inizio alla fine.',
    rating: 5,
  },
];

const ClientiPage = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-gold text-center mb-4">I nostri clienti</h2>
      <div className="text-center mb-4">
  <PoeticText text="Viaggiare con GratisEscape è più di una vacanza: è un’esperienza da condividere." />
</div>


      
      <div className="text-center mb-4">
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '640px',
            aspectRatio: '16 / 9',
            margin: '0 auto',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            backgroundColor: '#000',
          }}
        >
          <video
            controls
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          >
            <source src="/video/intro_guida.mp4" type="video/mp4" />
            Il tuo browser non supporta il video.
          </video>
        </div>
        <p className="mt-2">
          <em>“Segui la nostra guida fino all’ingresso dell’agenzia!”</em>
        </p>
      </div>

      
      <div className="row mb-5">
        {['parigi.png', 'giappone.png', 'thailandia.png'].map((img, i) => (
          <div key={i} className="col-md-4 mb-3 text-center">
            <img
              src={`/images/${img}`}
              alt="Viaggio GratisEscape"
              className="img-fluid rounded shadow"
              style={{ maxHeight: '220px', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      
      <h4 className="text-center mb-4">Recensioni dei nostri viaggiatori</h4>
      <div className="row">
        {recensioni.map((r, idx) => (
          <div key={idx} className="col-md-4 mb-3">
            <motion.div
              className="card p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              
              <div className="mb-2">
                {[...Array(r.rating)].map((_, i) => (
                  <StarFill key={i} color="#f5c518" className="me-1" />
                ))}
              </div>

              
              <p className="mb-2" style={{ fontStyle: 'italic' }}>“{r.testo}”</p>
              <p className="mb-0 text-end">- {r.nome}</p>
            </motion.div>
          </div>
        ))}
      </div>

      
      <div className="text-center mt-5">
        <h5>Seguici sui nostri social</h5>
        <div
          className="d-flex justify-content-center gap-4 mt-3"
          style={{ marginBottom: '2rem' }}
        >
          <Link
            to="https://instagram.com/gratisescape"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Instagram size={32} color="#5a4b27" />
          </Link>
          <Link
            to="https://facebook.com/gratisescape"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Facebook size={32} color="#5a4b27" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientiPage;

