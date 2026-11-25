import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Aviso from '../components/Aviso';
 
const rotulos = { xp: 'XP total', streak: 'dias de streak', missoes: 'missões concluídas' };
 
const formVazio = { nome: '', descricao: '', tipo: 'xp', valorMinimo: '' };
 
export default function Conquistas() {
  const [conquistas, setConquistas] = useState([]);
  const [form, setForm] = useState(formVazio);
  const [aviso, setAviso] = useState({ tipo: 'erro', texto: '' });
 
  function mostrarErro(texto) {
    setAviso({ tipo: 'erro', texto });
  }
 
  function mostrarOk(texto) {
    setAviso({ tipo: 'ok', texto });
  }
 
  async function carregar() {
    try {
      setConquistas(await api.get('/api/conquista/listar'));
    } catch (e) {
      mostrarErro(e.message);
    }
  }
 
  useEffect(() => {
    carregar();
  }, []);
 
  function aoDigitar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }
 
  async function aoSalvar(evento) {
    evento.preventDefault();
    try {
      // O valor mínimo precisa ir como número (o formulário guarda texto)
      await api.post('/api/conquista/cadastrar', { ...form, valorMinimo: Number(form.valorMinimo) });
      mostrarOk('Conquista cadastrada com sucesso!');
      setForm(formVazio);
      carregar();
    } catch (e) {
      mostrarErro(e.message);
    }
  }
 
  return (
    <section>
      <h2 className="titulo-pagina">Conquistas</h2>
      <Aviso tipo={aviso.tipo} texto={aviso.texto} />
 
      <form className="card formulario" onSubmit={aoSalvar}>
        <label className="campo">
          Nome
          <input name="nome" value={form.nome} onChange={aoDigitar} required />
        </label>
        <label className="campo">
          Descrição
          <input name="descricao" value={form.descricao} onChange={aoDigitar} />
        </label>
        <label className="campo">
          Tipo
          <select name="tipo" value={form.tipo} onChange={aoDigitar}>
            <option value="xp">xp (XP total)</option>
            <option value="streak">streak (dias seguidos)</option>
            <option value="missoes">missoes (missões concluídas)</option>
          </select>
        </label>
        <label className="campo">
          Valor mínimo
          <input name="valorMinimo" type="number" min="1" value={form.valorMinimo} onChange={aoDigitar} required />
        </label>
        <div className="acoes">
          <button className="btn btn-primario" type="submit">Cadastrar</button>
        </div>
      </form>
 
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
