import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Aviso from '../components/Aviso';
 
export default function Missoes() {
  const [missoes, setMissoes] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');
  const [aviso, setAviso] = useState({ tipo: 'erro', texto: '' });
 
  // A busca por título tem prioridade; senão usa o filtro de dificuldade
  async function carregar(termo = busca, dificuldade = filtro) {
    try {
      setAviso({ tipo: 'erro', texto: '' });
      let caminho = '/api/missao/listar';
      if (termo.trim()) caminho = `/api/missao/buscar/${encodeURIComponent(termo.trim())}`;
      else if (dificuldade) caminho = `/api/missao/listar/dificuldade/${dificuldade}`;
      setMissoes(await api.get(caminho));
    } catch (e) {
      // 404 = a busca não encontrou nenhuma missão
      if (e.status === 404) setMissoes([]);
      else setAviso({ tipo: 'erro', texto: e.message });
    }
  }
 
  useEffect(() => {
    carregar();
  }, []);
 
  function aoBuscar(evento) {
    evento.preventDefault();
    carregar(busca, filtro);
  }
 
  function aoMudarFiltro(evento) {
    setFiltro(evento.target.value);
    carregar(busca, evento.target.value);
  }
 
  function limpar() {
    setBusca('');
    setFiltro('');
    carregar('', '');
  }
 
  return (
    <section className="tela-missoes">
      <h2 className="titulo-pagina">Missões</h2>
      <Aviso tipo={aviso.tipo} texto={aviso.texto} />
 
      <form className="barra-busca" onSubmit={aoBuscar}>
        <input
          className="campo-texto"
          placeholder="Buscar por título..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select className="campo-texto" value={filtro} onChange={aoMudarFiltro}>
          <option value="">Todas as dificuldades</option>
          <option value="Facil">Facil</option>
          <option value="Media">Media</option>
          <option value="Dificil">Dificil</option>
        </select>
        <button className="btn btn-primario" type="submit">Buscar</button>
        <button className="btn btn-secundario" type="button" onClick={limpar}>Limpar</button>
      </form>
 
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
        {missoes.length === 0 && <p className="vazio">Nenhuma missão encontrada.</p>}
      </div>
    </section>
  );
}
 