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
 
export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState('');
 
  useEffect(() => {
    api
      .get('/api/relatorio/resumo')
      .then(setResumo)
      .catch((e) => setErro(e.message));
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
    </section>
  );
}
