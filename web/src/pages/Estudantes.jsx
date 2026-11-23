import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Aviso from '../components/Aviso';

const formVazio = { nome: '', curso: '', email: '' };

export default function Estudantes() {
  const [estudantes, setEstudantes] = useState([]);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(formVazio);
  const [editandoId, setEditandoId] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [aviso, setAviso] = useState({ tipo: 'erro', texto: '' });

  function mostrarErro(texto) {
    setAviso({ tipo: 'erro', texto });
  }

  function mostrarOk(texto) {
    setAviso({ tipo: 'ok', texto });
  }

  async function carregar(nome = '') {
    try {
      const termo = nome.trim();
      const caminho = termo
        ? `/api/estudante/buscar/${encodeURIComponent(termo)}`
        : '/api/estudante/listar';
      setEstudantes(await api.get(caminho));
    } catch (e) {
      if (e.status === 404) setEstudantes([]);
      else mostrarErro(e.message);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function aoBuscar(evento) {
    evento.preventDefault();
    carregar(busca);
  }

  function limparBusca() {
    setBusca('');
    carregar();
  }

  function aoDigitar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setForm(formVazio);
  }

  function iniciarEdicao(estudante) {
    setEditandoId(estudante.id);
    setForm({ nome: estudante.nome, curso: estudante.curso, email: estudante.email });
    setAviso({ tipo: 'erro', texto: '' });
  }

  async function remover(estudante) {
    if (!window.confirm(`Remover o estudante ${estudante.nome}?`)) return;
    try {
      await api.delete(`/api/estudante/remover/${estudante.id}`);
      mostrarOk('Estudante removido com sucesso!');
      if (editandoId === estudante.id) cancelarEdicao();
      setPerfil(null);
      carregar(busca);
    } catch (e) {
      // Ex.: estudante com conclusões registradas não pode ser removido
      mostrarErro(e.message);
    }
  }

  async function verPerfil(estudante) {
    try {
      setPerfil(await api.get(`/api/estudante/perfil/${estudante.id}`));
    } catch (e) {
      mostrarErro(e.message);
    }
  }

  async function aoSalvar(evento) {
    evento.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/api/estudante/alterar/${editandoId}`, form);
        mostrarOk('Estudante alterado com sucesso!');
      } else {
        await api.post('/api/estudante/cadastrar', form);
        mostrarOk('Estudante cadastrado com sucesso!');
      }
      cancelarEdicao();
      carregar(busca);
    } catch (e) {
      mostrarErro(e.message);
    }
  }

  return (
    <section>
      <h2 className="titulo-pagina">Estudantes</h2>
      <Aviso tipo={aviso.tipo} texto={aviso.texto} />

      <form className="card formulario" onSubmit={aoSalvar}>
        <label className="campo">
          Nome
          <input name="nome" value={form.nome} onChange={aoDigitar} required />
        </label>
        <label className="campo">
          Curso
          <input name="curso" value={form.curso} onChange={aoDigitar} />
        </label>
        <label className="campo">
          E-mail
          <input name="email" type="email" value={form.email} onChange={aoDigitar} required />
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

      {perfil && (
        <div className="card perfil-card">
          <div className="perfil-topo">
            <div className="avatar">{perfil.nome.charAt(0).toUpperCase()}</div>
            <div>
              <h3 className="perfil-nome">{perfil.nome}</h3>
              <span className="badge">{perfil.curso || 'Sem curso'}</span>
            </div>
            <button className="btn btn-secundario btn-pequeno" onClick={() => setPerfil(null)}>
              Fechar
            </button>
          </div>
          <div className="perfil-dados">
            <div><strong>Nível {perfil.nivel}</strong> · {perfil.titulo}</div>
            <div>{perfil.xpTotal} XP no total</div>
            <div>Streak: {perfil.streakAtual} dia(s)</div>
          </div>
          <div className="barra-progresso">
            <div className="preenchimento" style={{ width: `${100 - perfil.xpParaProximoNivel}%` }} />
          </div>
          <small>Faltam {perfil.xpParaProximoNivel} XP para o próximo nível</small>
        </div>
      )}

      <form className="barra-busca" onSubmit={aoBuscar}>
        <input
          className="campo-texto"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button className="btn btn-primario" type="submit">Buscar</button>
        <button className="btn btn-secundario" type="button" onClick={limparBusca}>Limpar</button>
      </form>

      <div className="card tabela-rolagem">
        <table className="tabela">
          <thead>
            <tr>
              <th>Nome</th><th>Curso</th><th>E-mail</th><th>XP</th><th>Nível</th><th>Streak</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {estudantes.map((e) => (
              <tr key={e.id}>
                <td>{e.nome}</td>
                <td>{e.curso}</td>
                <td>{e.email}</td>
                <td>{e.xpTotal}</td>
                <td>{e.nivel}</td>
                <td>{e.streakAtual}</td>
                <td>
                  <div className="acoes">
                    <button className="btn btn-primario btn-pequeno" onClick={() => verPerfil(e)}>
                      Perfil
                    </button>
                    <button className="btn btn-secundario btn-pequeno" onClick={() => iniciarEdicao(e)}>
                      Editar
                    </button>
                    <button className="btn btn-perigo btn-pequeno" onClick={() => remover(e)}>
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {estudantes.length === 0 && <p className="vazio">Nenhum estudante encontrado.</p>}
      </div>
    </section>
  );
}