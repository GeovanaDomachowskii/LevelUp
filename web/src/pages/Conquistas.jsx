import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Aviso from '../components/Aviso';
import './Conquistas.css';
 
const rotulos = { xp: 'XP total', streak: 'dias de streak', missoes: 'missões concluídas' };
 
const formVazio = { nome: '', descricao: '', tipo: 'xp', valorMinimo: '' };
 
export default function Conquistas() {
  const [conquistas, setConquistas] = useState([]);
  const [form, setForm] = useState(formVazio);
  const [editandoId, setEditandoId] = useState(null);
  const [estudantes, setEstudantes] = useState([]);
  const [estudanteId, setEstudanteId] = useState('');
  const [progresso, setProgresso] = useState(null);
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
    api
      .get('/api/estudante/listar')
      .then(setEstudantes)
      .catch((e) => mostrarErro(e.message));
  }, []);
 
  // Mostra quais conquistas o estudante escolhido já liberou
  async function escolherEstudante(evento) {
    const id = evento.target.value;
    setEstudanteId(id);
    setProgresso(null);
    if (!id) return;
    try {
      setProgresso(await api.get(`/api/conquista/estudante/${id}`));
    } catch (e) {
      mostrarErro(e.message);
    }
  }
 
  const idsLiberadas = progresso ? progresso.liberadas.map((l) => l.id) : [];
 
  function aoDigitar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }
 
  function cancelarEdicao() {
    setEditandoId(null);
    setForm(formVazio);
  }
 
  function iniciarEdicao(conquista) {
    setEditandoId(conquista.id);
    setForm({
      nome: conquista.nome,
      descricao: conquista.descricao,
      tipo: conquista.tipo,
      valorMinimo: String(conquista.valorMinimo),
    });
    setAviso({ tipo: 'erro', texto: '' });
  }
 
  async function remover(conquista) {
    if (!window.confirm(`Remover a conquista "${conquista.nome}"?`)) return;
    try {
      await api.delete(`/api/conquista/remover/${conquista.id}`);
      mostrarOk('Conquista removida com sucesso!');
      if (editandoId === conquista.id) cancelarEdicao();
      carregar();
    } catch (e) {
      mostrarErro(e.message);
    }
  }
 
  async function aoSalvar(evento) {
    evento.preventDefault();
    try {
      // O valor mínimo precisa ir como número (o formulário guarda texto)
      const dados = { ...form, valorMinimo: Number(form.valorMinimo) };
      if (editandoId) {
        await api.put(`/api/conquista/alterar/${editandoId}`, dados);
        mostrarOk('Conquista alterada com sucesso!');
      } else {
        await api.post('/api/conquista/cadastrar', dados);
        mostrarOk('Conquista cadastrada com sucesso!');
      }
      cancelarEdicao();
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
          <button className="btn btn-primario" type="submit">
            {editandoId ? 'Salvar alterações' : 'Cadastrar'}
          </button>
          {editandoId && (
            <button className="btn btn-secundario" type="button" onClick={cancelarEdicao}>
              Cancelar
            </button>
          )}
        </div>
      </form>
 
      <div className="card">
        <label className="campo" style={{ maxWidth: 360 }}>
          Ver conquistas liberadas de um estudante
          <select value={estudanteId} onChange={escolherEstudante}>
            <option value="">Selecione...</option>
            {estudantes.map((e) => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </select>
        </label>
        {progresso && (
          <p className="resumo-progresso">
            <strong>{progresso.estudante}</strong>: {progresso.xpTotal} XP, streak de {progresso.streakAtual} dia(s),{' '}
            {progresso.missoesConcluidas} missão(ões) concluída(s) ·{' '}
            <strong>{progresso.liberadas.length}</strong> de {conquistas.length} conquistas liberadas
          </p>
        )}
      </div>
 
      <div className="grid-cards">
        {conquistas.map((c) => (
          <div
            key={c.id}
            className={
              progresso && !idsLiberadas.includes(c.id) ? 'card conquista bloqueada' : 'card conquista'
            }
          >
            <div className="conquista-topo">
              <strong>{c.nome}</strong>
              <span className="badge">{c.tipo}</span>
              {progresso && idsLiberadas.includes(c.id) && <span className="selo-dia">Liberada</span>}
            </div>
            <p>{c.descricao}</p>
            <small>Requisito: {c.valorMinimo} {rotulos[c.tipo]}</small>
            <div className="acoes">
              <button className="btn btn-secundario btn-pequeno" onClick={() => iniciarEdicao(c)}>
                Editar
              </button>
              <button className="btn btn-perigo btn-pequeno" onClick={() => remover(c)}>
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
      {conquistas.length === 0 && <p className="vazio">Nenhuma conquista cadastrada.</p>}
    </section>
  );
}
 
