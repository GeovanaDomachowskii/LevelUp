// Mensagem de erro ou de sucesso. Não mostra nada se o texto estiver vazio.
export default function Aviso({ tipo = 'erro', texto }) {
  if (!texto) return null;
  return (
    <div className={`aviso aviso-${tipo}`} role="alert">
      {texto}
    </div>
  );
}
