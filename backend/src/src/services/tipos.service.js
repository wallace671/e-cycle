// ============================================================
// Service de TIPOS DE RESIDUO
// ============================================================
const db = require('../config/db');
const { ErroApi } = require('../middlewares/erro');

async function listar() {
  const r = await db.query('SELECT * FROM tipos_residuo ORDER BY id_tipo');
  return r.rows;
}

async function buscarPorId(id) {
  const r = await db.query('SELECT * FROM tipos_residuo WHERE id_tipo = $1', [id]);
  if (r.rows.length === 0) throw new ErroApi(404, 'Tipo de residuo nao encontrado.');
  return r.rows[0];
}

async function criar({ nome, descricao }) {
  const r = await db.query(
    'INSERT INTO tipos_residuo (nome, descricao) VALUES ($1, $2) RETURNING *',
    [nome, descricao || null]
  );
  return r.rows[0];
}

async function atualizar(id, { nome, descricao }) {
  const r = await db.query(
    `UPDATE tipos_residuo
        SET nome = COALESCE($2, nome),
            descricao = COALESCE($3, descricao)
      WHERE id_tipo = $1 RETURNING *`,
    [id, nome, descricao]
  );
  if (r.rows.length === 0) throw new ErroApi(404, 'Tipo de residuo nao encontrado.');
  return r.rows[0];
}

async function remover(id) {
  const r = await db.query(
    'DELETE FROM tipos_residuo WHERE id_tipo = $1 RETURNING id_tipo',
    [id]
  );
  if (r.rows.length === 0) throw new ErroApi(404, 'Tipo de residuo nao encontrado.');
  return { id_tipo: r.rows[0].id_tipo };
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
