// ============================================================
// Service de AUTENTICACAO
//   registrar -> cria um usuario COMUM (cliente) e ja loga
//   login     -> confere email + senha e devolve o token
// ============================================================
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { ErroApi } = require('../middlewares/erro');
const { gerarToken } = require('../middlewares/auth');

const ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10);

// Cadastro publico: sempre cria como 'comum' (ninguem se cadastra como admin).
async function registrar({ nome, email, senha, telefone }) {
  const senhaHash = await bcrypt.hash(senha, ROUNDS);
  const r = await db.query(
    `INSERT INTO usuarios (nome, email, senha, telefone, tipo_usuario)
     VALUES ($1, $2, $3, $4, 'comum')
     RETURNING id_usuario, nome, email, tipo_usuario`,
    [nome, email, senhaHash, telefone || null]
  );
  const usuario = r.rows[0];
  return { usuario, token: gerarToken(usuario) };
}

// Login: busca o usuario pelo email, compara a senha com o hash.
async function login({ email, senha }) {
  const r = await db.query(
    'SELECT id_usuario, nome, email, senha, tipo_usuario, id_ponto FROM usuarios WHERE email = $1',
    [email]
  );
  const usuario = r.rows[0];

  // Mensagem generica de proposito (nao revela se o email existe).
  if (!usuario) throw new ErroApi(401, 'E-mail ou senha invalidos.');

  const confere = await bcrypt.compare(senha, usuario.senha);
  if (!confere) throw new ErroApi(401, 'E-mail ou senha invalidos.');

  // Nunca devolve a senha.
  delete usuario.senha;
  return { usuario, token: gerarToken(usuario) };
}

module.exports = { registrar, login };
