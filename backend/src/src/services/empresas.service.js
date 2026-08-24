// ============================================================
// Service de EMPRESAS RECICLADORAS
// ============================================================
const db = require('../config/db');
const { ErroApi } = require('../middlewares/erro');

async function listar() {
  const r = await db.query('SELECT * FROM empresas ORDER BY id_empresa');
  return r.rows;
}

async function buscarPorId(id) {
  const r = await db.query('SELECT * FROM empresas WHERE id_empresa = $1', [id]);
  if (r.rows.length === 0) throw new ErroApi(404, 'Empresa nao encontrada.');
  return r.rows[0];
}

async function criar({ nome_empresa, cnpj, contato }) {
  const r = await db.query(
    `INSERT INTO empresas (nome_empresa, cnpj, contato)
     VALUES ($1, $2, $3) RETURNING *`,
    [nome_empresa, cnpj, contato || null]
  );
  return r.rows[0];
}

async function atualizar(id, { nome_empresa, cnpj, contato }) {
  const r = await db.query(
    `UPDATE empresas
        SET nome_empresa = COALESCE($2, nome_empresa),
            cnpj = COALESCE($3, cnpj),
            contato = COALESCE($4, contato)
      WHERE id_empresa = $1
      RETURNING *`,
    [id, nome_empresa, cnpj, contato]
  );
  if (r.rows.length === 0) throw new ErroApi(404, 'Empresa nao encontrada.');
  return r.rows[0];
}

async function remover(id) {
  const r = await db.query(
    'DELETE FROM empresas WHERE id_empresa = $1 RETURNING id_empresa',
    [id]
  );
  if (r.rows.length === 0) throw new ErroApi(404, 'Empresa nao encontrada.');
  return { id_empresa: r.rows[0].id_empresa };
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
