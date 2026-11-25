import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Aviso from '../components/Aviso';
 
export default function Conclusoes() {
  const [estudantes, setEstudantes] = useState([]);
  const [missoes, setMissoes] = useState([]);
  const [estudanteId, setEstudanteId] = useState('');
  const [missaoId, setMissaoId] = useState('');
  const [resultado, setResultado] = useState(null);
  const [aviso, setAviso] = useState({ tipo: 'erro', texto: '' });
 
  useEffect(() => {
    async function carregar() {
      try {
        setEstudantes(await api.get('/api/estudante/listar'));
        setMissoes(await api.get('/api/missao/listar'));
      } catch (e) {
        setAviso({ tipo: 'erro', texto: e.message });
      }
    }
    carregar();
  }, []);
 
  async function concluir(evento) {
    evento.preventDefault();
    setResultado(null);
    try {
      const resposta = await api.post('/api/conclusao/registrar', { estudanteId, missaoId });
      setResultado(resposta);
      setAviso({ tipo: 'ok', texto: 'Missão concluída com sucesso!' });
    } catch (e) {
      // Ex.: "Missão já concluída hoje!"
      setAviso({ tipo: 'erro', texto: e.message });
    }
  }
 
  return (
    <section className="tela-conclusoes">
      <h2 className="titulo-pagina">Concluir missão</h2>
      <Aviso tipo={aviso.tipo} texto={aviso.texto} />
 
      <form className="card formulario" onSubmit={concluir}>
        <label className="campo">
          Estudante
          <select value={estudanteId} onChange={(e) => setEstudanteId(e.target.value)} required>
            <option value="">Selecione...</option>
            {estudantes.map((e) => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </select>
        </label>
        <label className="campo">
          Missão
          <select value={missaoId} onChange={(e) => setMissaoId(e.target.value)} required>
            <option value="">Selecione...</option>
            {missoes.map((m) => (
              <option key={m.id} value={m.id}>
                {m.titulo} ({m.xp} XP){m.missaoDoDia ? ' - missão do dia' : ''}
              </option>
            ))}
          </select>
        </label>
        <div className="acoes">
          <button className="btn btn-primario" type="submit">Concluir missão</button>
        </div>
      </form>
 
      {resultado && (
        <div className="card resultado">
          <h3 className="subtitulo" style={{ marginTop: 0 }}>Resultado</h3>
          <div className="grid-cards">
            <div className="cartao-numero">
              <div className="rotulo">XP ganho</div>
              <div className="valor">+{resultado.conclusao.xpGanho}</div>
            </div>
            <div className="cartao-numero">
              <div className="rotulo">XP total</div>
              <div className="valor">{resultado.xpTotal}</div>
            </div>
            <div className="cartao-numero">
              <div className="rotulo">Nível</div>
              <div className="valor">{resultado.nivel}</div>
            </div>
            <div className="cartao-numero">
              <div className="rotulo">Título</div>
              <div className="valor">{resultado.titulo}</div>
            </div>
            <div className="cartao-numero">
              <div className="rotulo">Streak</div>
              <div className="valor">{resultado.streakAtual} dia(s)</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
 
