import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Estudantes from './pages/Estudantes';
import Missoes from './pages/Missoes';
import Conquistas from './pages/Conquistas';
import Conclusoes from './pages/Conclusoes';
import Rankings from './pages/Rankings';
 
// Cada tela tem um título (no menu) e o componente que a desenha
const telas = {
  dashboard: { titulo: 'Início', componente: Dashboard },
  estudantes: { titulo: 'Estudantes', componente: Estudantes },
  missoes: { titulo: 'Missões', componente: Missoes },
  conclusoes: { titulo: 'Concluir missão', componente: Conclusoes },
  conquistas: { titulo: 'Conquistas', componente: Conquistas },
  rankings: { titulo: 'Rankings', componente: Rankings },
};
 
export default function App() {
  const [tela, setTela] = useState('dashboard');
  const TelaAtual = telas[tela].componente;
 
  return (
    <div className="app">
      <Navbar telas={telas} atual={tela} aoMudar={setTela} />
      <main className="conteudo">
        <TelaAtual aoNavegar={setTela} />
      </main>
    </div>
  );
}
