// ============================================================
// Middlewares de SEGURANCA
//   autenticar   -> exige um token JWT valido (usuario logado)
//   apenasAdmin  -> exige que o usuario seja do tipo 'admin'
// ============================================================
const jwt = require('jsonwebtoken');
const { ErroApi } = require('./erro');

const SEGREDO = process.env.JWT_SECRET || 'segredo-de-desenvolvimento';

// Gera um token para um usuario (usado no login e no cadastro).
function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id_usuario, nome: usuario.nome, tipo: usuario.tipo_usuario, id_ponto: usuario.id_ponto ?? null },
    SEGREDO,
    { expiresIn: process.env.JWT_EXPIRA || '8h' }
  );
}

// Le o token do cabecalho "Authorization: Bearer <token>" e valida.
function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const token = cabecalho.startsWith('Bearer ') ? cabecalho.slice(7) : null;
  if (!token) return next(new ErroApi(401, 'Token nao informado. Faca login.'));

  try {
    // Se valido, guarda os dados do usuario em req.usuario para as rotas usarem.
    req.usuario = jwt.verify(token, SEGREDO);
    next();
  } catch {
    next(new ErroApi(401, 'Token invalido ou expirado.'));
  }
}

// So deixa passar se o usuario for admin (use depois de autenticar).
function apenasAdmin(req, res, next) {
  if (req.usuario?.tipo !== 'admin') {
    return next(new ErroApi(403, 'Acesso restrito a administradores.'));
  }
  next();
}

module.exports = { gerarToken, autenticar, apenasAdmin };
