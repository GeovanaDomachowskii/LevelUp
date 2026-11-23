// Cliente de API: todas as telas usam este arquivo para falar com o back-end.
const BASE_URL = 'http://localhost:5262';
 
async function requisicao(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(BASE_URL + caminho, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Ela está ligada?');
  }
 
  // A API devolve JSON na maioria dos casos e texto simples em outros
  const texto = await resposta.text();
  let corpo = null;
  if (texto) {
    try {
      corpo = JSON.parse(texto);
    } catch {
      corpo = texto;
    }
  }
 
  if (!resposta.ok) {
    const mensagem =
      typeof corpo === 'string' ? corpo : `Erro ${resposta.status} ao falar com a API`;
    const erro = new Error(mensagem);
    erro.status = resposta.status;
    throw erro;
  }
  return corpo;
}
 
export const api = {
  get: (caminho) => requisicao(caminho),
  post: (caminho, dados) =>
    requisicao(caminho, { method: 'POST', body: JSON.stringify(dados) }),
  put: (caminho, dados) =>
    requisicao(caminho, {
      method: 'PUT',
      body: dados === undefined ? undefined : JSON.stringify(dados),
    }),
  delete: (caminho) => requisicao(caminho, { method: 'DELETE' }),
};
