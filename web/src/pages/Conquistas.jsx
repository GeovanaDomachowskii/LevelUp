import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Aviso from '../components/Aviso';
 
const rotulos = { xp: 'XP total', streak: 'dias de streak', missoes: 'missões concluídas' };
 
export default function Conquistas() {
  const [conquistas, setConquistas] = useState([]);
  const [aviso, setAviso] = useState({ tipo: 'erro', texto: '' });
 
  async function carregar() {
    try {
      setAviso({ tipo: 'erro', texto: '' });
      setConquistas(await api.get('/api/conquista/listar'));
    } catch (e) {
      setAviso({ tipo: 'erro', texto: e.message });
    }
  }
 
  useEffect(() => {
    carregar();
  }, []);
 
  return (
    <section>
      <h2 className="titulo-pagina">Conquistas</h2>
      <Aviso tipo={aviso.tipo} texto={aviso.texto} />
 
      <div className="grid-cards">
        {conquistas.map((c) => (
          <div key={c.id} className="card conquista">
            <div className="conquista-topo">
              <strong>{c.nome}</strong>
              <span className="badge">{c.tipo}</span>
            </div>
            <p>{c.descricao}</p>
            <small>Requisito: {c.valorMinimo} {rotulos[c.tipo]}</small>
          </div>
        ))}
      </div>
      {conquistas.length === 0 && <p className="vazio">Nenhuma conquista cadastrada.</p>}
    </section>
  );
}
