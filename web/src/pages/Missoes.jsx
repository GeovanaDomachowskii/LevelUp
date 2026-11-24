import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Aviso from '../components/Aviso';
 
export default function Missoes() {
  const [missoes, setMissoes] = useState([]);
  const [aviso, setAviso] = useState({ tipo: 'erro', texto: '' });
 
  async function carregar() {
    try {
      setAviso({ tipo: 'erro', texto: '' });
      setMissoes(await api.get('/api/missao/listar'));
    } catch (e) {
      setAviso({ tipo: 'erro', texto: e.message });
    }
  }
 
  useEffect(() => {
    carregar();
  }, []);
 
  return (
    <section className="tela-missoes">
      <h2 className="titulo-pagina">Missões</h2>
      <Aviso tipo={aviso.tipo} texto={aviso.texto} />
 
      <div className="card tabela-rolagem">
        <table className="tabela">
          <thead>
            <tr>
              <th>Título</th><th>Descrição</th><th>XP</th><th>Dificuldade</th>
            </tr>
          </thead>
          <tbody>
            {missoes.map((m) => (
              <tr key={m.id}>
                <td>
                  {m.titulo}
                  {m.missaoDoDia && <span className="selo-dia">Missão do dia</span>}
                </td>
                <td>{m.descricao}</td>
                <td>{m.xp}</td>
                <td>
                  <span className={`badge badge-${m.dificuldade.toLowerCase()}`}>{m.dificuldade}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {missoes.length === 0 && <p className="vazio">Nenhuma missão cadastrada.</p>}
      </div>
    </section>
  );
}
 
