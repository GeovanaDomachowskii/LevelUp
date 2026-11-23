import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Aviso from '../components/Aviso';

export default function Estudantes() {
  const [estudantes, setEstudantes] = useState([]);
  const [busca, setBusca] = useState('');
  const [aviso, setAviso] = useState({ tipo: 'erro', texto: '' });

  async function carregar(nome = '') {
    try {
      setAviso({ tipo: 'erro', texto: '' });
      const termo = nome.trim();
      const caminho = termo
        ? `/api/estudante/buscar/${encodeURIComponent(termo)}`
        : '/api/estudante/listar';
      setEstudantes(await api.get(caminho));
    } catch (e) {
      // 404 = a busca não encontrou ninguém
      if (e.status === 404) setEstudantes([]);
      else setAviso({ tipo: 'erro', texto: e.message });
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

  return (
    <section>
      <h2 className="titulo-pagina">Estudantes</h2>
      <Aviso tipo={aviso.tipo} texto={aviso.texto} />

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