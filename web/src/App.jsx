import { useEffect, useState } from 'react';
import { api } from './services/api';
 
export default function App() {
  const [status, setStatus] = useState('verificando...');
 
  useEffect(() => {
    api
      .get('/')
      .then((texto) => setStatus('conectada: ' + texto))
      .catch((e) => setStatus('com erro: ' + e.message));
  }, []);
 
  return (
    <div>
      <h1>Level Up</h1>
      <p>API {status}</p>
    </div>
  );
}
