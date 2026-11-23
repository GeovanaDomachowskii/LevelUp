import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Aviso from '../components/Aviso';
 
function CartaoNumero({ rotulo, valor }) {
  return (
    <div className="cartao-numero">
      <div className="rotulo">{rotulo}</div>
      <div className="valor">{valor}</div>
    </div>
  );
}
 
export default function Dashboard({ aoNavegar }) {
  const [resumo, setResumo] = useState(null);
  const [missaoDoDia, setMissaoDoDia] = useState(null);
  const [maisConcluidas, setMaisConcluidas] = useState([]);
  const [erro, setErro] = useState('');
 
  useEffect(() => {
    async function carregar() {
      try {
        setResumo(await api.get('/api/relatorio/resumo'));
        setMaisConcluidas(await api.get('/api/missao/mais-concluidas'));
        try {
          setMissaoDoDia(await api.get('/api/missao/do-dia'));
        } catch (e) {
          // 404 = ainda não foi sorteada nenhuma missão do dia
          if (e.status !== 404) throw e;
        }
      } catch (e) {
        setErro(e.message);
      }
    }
    carregar();
  }, []);
 
  return (
    <section>
      <h2 className="titulo-pagina">Início</h2>
      <Aviso texto={erro} />
 
      {resumo && (
        <div className="grid-cards">
          <CartaoNumero rotulo="Estudantes" valor={resumo.totalEstudantes} />
          <CartaoNumero rotulo="Missões" valor={resumo.totalMissoes} />
          <CartaoNumero rotulo="Conclusões" valor={resumo.totalConclusoes} />
          <CartaoNumero rotulo="XP distribuído" valor={resumo.xpDistribuido} />
          <CartaoNumero rotulo="Conclusões na semana" valor={resumo.conclusoesNaSemana} />
          <CartaoNumero rotulo="Missão mais concluída" valor={resumo.missaoMaisConcluida ?? '—'} />
        </div>
      )}
 
      <div className="card">
        <h3 className="subtitulo" style={{ marginTop: 0 }}>Missão do dia</h3>
        {missaoDoDia ? (
          <>
            <p>
              <strong>{missaoDoDia.titulo}</strong>
              <span className="selo-dia">XP em dobro</span>
            </p>
            <p>{missaoDoDia.descricao}</p>
            <p>
              Vale {missaoDoDia.xp} XP (dobra para {missaoDoDia.xp * 2} XP, antes do bônus de streak).
            </p>
          </>
        ) : (
          <p className="vazio">Nenhuma missão do dia sorteada ainda.</p>
        )}
        <button className="btn btn-primario" onClick={() => aoNavegar('missoes')}>
          Ver missões
        </button>
      </div>
 
      <div className="card">
        <h3 className="subtitulo" style={{ marginTop: 0 }}>Missões mais concluídas</h3>
        {maisConcluidas.length === 0 ? (
          <p className="vazio">Ainda não há conclusões registradas.</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr><th>#</th><th>Missão</th><th>Conclusões</th></tr>
            </thead>
            <tbody>
              {maisConcluidas.map((m, i) => (
                <tr key={m.missaoId}>
                  <td>{i + 1}</td>
                  <td>{m.titulo}</td>
                  <td>{m.totalConclusoes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
