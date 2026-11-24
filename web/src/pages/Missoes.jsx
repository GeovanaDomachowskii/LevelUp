import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Aviso from '../components/Aviso';
 
const formVazio = { titulo: '', descricao: '', xp: '', dificuldade: 'Facil' };
 
export default function Missoes() {
  const [missoes, setMissoes] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');
  const [form, setForm] = useState(formVazio);
  const [aviso, setAviso] = useState({ tipo: 'erro', texto: '' });
 
  function mostrarErro(texto) {
    setAviso({ tipo: 'erro', texto });
  }
 
  function mostrarOk(texto) {
    setAviso({ tipo: 'ok', texto });
  }
 
  // A busca por título tem prioridade; senão usa o filtro de dificuldade
  async function carregar(termo = busca, dificuldade = filtro) {
    try {
      let caminho = '/api/missao/listar';
      if (termo.trim()) caminho = `/api/missao/buscar/${encodeURIComponent(termo.trim())}`;
      else if (dificuldade) caminho = `/api/missao/listar/dificuldade/${dificuldade}`;
      setMissoes(await api.get(caminho));
    } catch (e) {
      if (e.status === 404) setMissoes([]);
      else mostrarErro(e.message);
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
 
  function aoDigitar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }
 
  async function aoSalvar(evento) {
    evento.preventDefault();
    try {
      // O XP precisa ir como número (o formulário guarda texto)
      await api.post('/api/missao/cadastrar', { ...form, xp: Number(form.xp) });
      mostrarOk('Missão cadastrada com sucesso!');
      setForm(formVazio);
      carregar(busca, filtro);
    } catch (e) {
      mostrarErro(e.message);
    }
  }
 
  return (
    <section className="tela-missoes">
      <h2 className="titulo-pagina">Missões</h2>
      <Aviso tipo={aviso.tipo} texto={aviso.texto} />
 
      <form className="card formulario" onSubmit={aoSalvar}>
        <label className="campo">
          Título
          <input name="titulo" value={form.titulo} onChange={aoDigitar} required />
        </label>
        <label className="campo">
          Descrição
          <input name="descricao" value={form.descricao} onChange={aoDigitar} />
        </label>
        <label className="campo">
          XP
          <input name="xp" type="number" min="1" value={form.xp} onChange={aoDigitar} required />
        </label>
        <label className="campo">
          Dificuldade
          <select name="dificuldade" value={form.dificuldade} onChange={aoDigitar}>
            <option value="Facil">Facil</option>
            <option value="Media">Media</option>
            <option value="Dificil">Dificil</option>
          </select>
        </label>
        <div className="acoes">
          <button className="btn btn-primario" type="submit">Cadastrar</button>
        </div>
      </form>
 
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
 
