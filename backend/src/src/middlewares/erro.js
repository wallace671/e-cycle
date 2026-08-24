// ============================================================
// Tratamento centralizado de erros.
// Qualquer erro passado por next(err) cai aqui.
// ============================================================

// Classe simples para erros com status HTTP definido.
class ErroApi extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

// Middleware de erro (precisa ter os 4 parametros).
function tratarErro(err, req, res, next) {
  // Erro de violacao de UNIQUE no Postgres (ex.: email/cnpj repetido)
  if (err.code === '23505') {
    return res.status(409).json({ erro: 'Registro duplicado (valor unico ja existe).' });
  }
  // Erro de violacao de FK (ex.: id_usuario inexistente)
  if (err.code === '23503') {
    return res.status(400).json({ erro: 'Referencia invalida (chave estrangeira nao encontrada).' });
  }

  const status = err.status || 500;
  const mensagem = err.status ? err.message : 'Erro interno no servidor.';
  if (status === 500) console.error('[erro]', err);
  res.status(status).json({ erro: mensagem });
}

// Middleware para rotas nao encontradas.
function naoEncontrado(req, res) {
  res.status(404).json({ erro: 'Rota nao encontrada.' });
}

module.exports = { ErroApi, tratarErro, naoEncontrado };
