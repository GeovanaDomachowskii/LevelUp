import { useEffect, useState } from 'react';
import { api } from '../services/api';
 
export default function Navbar({ telas, atual, aoMudar }) {
  const [online, setOnline] = useState(null);
 
  useEffect(() => {
    api
      .get('/')
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);
 
  const textoStatus = online === null ? '...' : online ? 'API online' : 'API offline';
 
  return (
    <header className="navbar">
      <h1 className="marca">Level Up</h1>
      <nav className="menu">
        {Object.entries(telas).map(([chave, tela]) => (
          <button
            key={chave}
            className={chave === atual ? 'menu-item ativo' : 'menu-item'}
            onClick={() => aoMudar(chave)}
          >
            {tela.titulo}
          </button>
        ))}
      </nav>
      <span className={online === false ? 'status offline' : 'status online'}>
        {textoStatus}
      </span>
    </header>
  );
}
