// ============================================================
// Service de USUARIOS
// Regra de negocio + acesso ao banco (SQL puro via pg).
// A senha nunca e devolvida nas respostas.
// ============================================================
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { ErroApi } = require('../middlewares/erro');

const ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10);

// Colunas que podem ser retornadas (sem a senha!)
const COLUNAS = 'id_usuario, nome, email, telefone, tipo_usuario, criado_em';

async function listar() {
  const r = await db.query(`SELECT ${COLUNAS} FROM usuarios ORDER BY id_usuario`);
  return r.rows;
}

async function buscarPorId(id) {
  const r = await db.query(
    `SELECT ${COLUNAS} FROM usuarios WHERE id_usuario = $1`,
    [id]
  );
  if (r.rows.length === 0) throw new ErroApi(404, 'Usuario nao encontrado.');
  return r.rows[0];
}

async function criar({ nome, email, senha, telefone, tipo_usuario }) {
  // Gera o HASH da senha (nunca guardamos a senha em texto).
  const senhaHash = await bcrypt.hash(senha, ROUNDS);
  const r = await db.query(
    `INSERT INTO usuarios (nome, email, senha, telefone, tipo_usuario)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUNAS}`,
    [nome, email, senhaHash, telefone || null, tipo_usuario || 'comum']
  );
  return r.rows[0];
}

async function atualizar(id, { nome, email, telefone, tipo_usuario }) {
  const r = await db.query(
    `UPDATE usuarios
        SET nome = COALESCE($2, nome),
            email = COALESCE($3, email),
            telefone = COALESCE($4, telefone),
            tipo_usuario = COALESCE($5, tipo_usuario)
      WHERE id_usuario = $1
      RETURNING ${COLUNAS}`,
    [id, nome, email, telefone, tipo_usuario]
  );
  if (r.rows.length === 0) throw new ErroApi(404, 'Usuario nao encontrado.');
  return r.rows[0];
}

async function remover(id) {
  const r = await db.query(
    'DELETE FROM usuarios WHERE id_usuario = $1 RETURNING id_usuario',
    [id]
  );
  if (r.rows.length === 0) throw new ErroApi(404, 'Usuario nao encontrado.');
  return { id_usuario: r.rows[0].id_usuario };
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
