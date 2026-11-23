import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Aviso from '../components/Aviso';
import './Rankings.css';

const abas = [
  { id: 'geral', nome: 'Geral' },
  { id: 'semanal', nome: 'Semanal' },
  { id: 'curso', nome: 'Por curso' },
];

export default function Rankings() {
  const [aba, setAba] = useState('geral');
  const [cursos, setCursos] = useState([]);
  const [curso, setCurso] = useState('');
  const [lista, setLista] = useState([]);
  const [erro, setErro] = useState('');

  // Descobre os cursos cadastrados para montar a lista de escolha
  useEffect(() => {
    api
      .get('/api/estudante/listar')
      .then((estudantes) => {
        const unicos = [...new Set(estudantes.map((e) => e.curso).filter(Boolean))];
        setCursos(unicos);
        if (unicos.length > 0) setCurso(unicos[0]);
      })
      .catch((e) => setErro(e.message));
  }, []);

  // Carrega o ranking sempre que muda a aba (ou o curso escolhido)
  useEffect(() => {
    async function carregar() {
      setErro('');
      setLista([]);
      let caminho = `/api/ranking/${aba}`;
      if (aba === 'curso') {
        if (!curso) return;
        caminho = `/api/ranking/curso/${encodeURIComponent(curso)}`;
      }
      try {
        setLista(await api.get(caminho));
      } catch (e) {
        if (e.status !== 404) setErro(e.message);
      }
    }
    carregar();
  }, [aba, curso]);

  return (
    <section>
      <h2 className="titulo-pagina">Rankings</h2>
      <Aviso texto={erro} />

      <div className="abas">
        {abas.map((a) => (
          <button
            key={a.id}
            className={a.id === aba ? 'aba ativa' : 'aba'}
            onClick={() => setAba(a.id)}
          >
            {a.nome}
          </button>
        ))}
      </div>

      {aba === 'curso' && (
        <label className="campo" style={{ maxWidth: 320, marginBottom: 16 }}>
          Curso
          <select value={curso} onChange={(e) => setCurso(e.target.value)}>
            {cursos.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      )}

      <div className="card tabela-rolagem">
        <table className="tabela">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              {aba === 'geral' && <th>Curso</th>}
              <th>{aba === 'semanal' ? 'XP na semana' : 'XP total'}</th>
              {aba !== 'semanal' && <th>Nível</th>}
              {aba === 'geral' && <th>Título</th>}
            </tr>
          </thead>
          <tbody>
            {lista.map((item, i) => (
              <tr key={item.nome + i}>
                <td><span className={`pos pos-${i + 1}`}>{i + 1}</span></td>
                <td>{item.nome}</td>
                {aba === 'geral' && <td>{item.curso}</td>}
                <td>{aba === 'semanal' ? item.xpSemana : item.xpTotal}</td>
                {aba !== 'semanal' && <td>{item.nivel}</td>}
                {aba === 'geral' && <td>{item.titulo}</td>}
              </tr>
            ))}
          </tbody>
        </table>
        {lista.length === 0 && <p className="vazio">Sem dados para este ranking.</p>}
      </div>
    </section>
  );
}