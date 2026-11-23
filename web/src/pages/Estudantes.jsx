import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Aviso from '../components/Aviso';

const formVazio = { nome: '', curso: '', email: '' };

export default function Estudantes() {
  const [estudantes, setEstudantes] = useState([]);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(formVazio);
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

  async function aoSalvar(evento) {
    evento.preventDefault();
    try {
      await api.post('/api/estudante/cadastrar', form);
      mostrarOk('Estudante cadastrado com sucesso!');
      setForm(formVazio);
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
          <button className="btn btn-primario" type="submit">Cadastrar</button>
        </div>
      </form>

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
              <th>Nome</th><th>Curso</th><th>E-mail</th><th>XP</th><th>Nível</th><th>Streak</th>
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
              </tr>
            ))}
          </tbody>
        </table>
        {estudantes.length === 0 && <p className="vazio">Nenhum estudante encontrado.</p>}
      </div>
    </section>
  );
}