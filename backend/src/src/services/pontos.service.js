// ============================================================
// Service de PONTOS DE COLETA
// Cada ponto pertence a uma empresa (FK id_empresa).
// A listagem traz o nome da empresa (JOIN).
// ============================================================
const db = require('../config/db');
const { ErroApi } = require('../middlewares/erro');

async function listar() {
  const r = await db.query(
    `SELECT pc.id_ponto, pc.nome_local, pc.endereco, pc.cidade,
            pc.id_empresa, e.nome_empresa
       FROM pontos_coleta pc
       JOIN empresas e ON e.id_empresa = pc.id_empresa
      ORDER BY pc.id_ponto`
  );
  return r.rows;
}

async function buscarPorId(id) {
  const r = await db.query(
    `SELECT pc.*, e.nome_empresa
       FROM pontos_coleta pc
       JOIN empresas e ON e.id_empresa = pc.id_empresa
      WHERE pc.id_ponto = $1`,
    [id]
  );
  if (r.rows.length === 0) throw new ErroApi(404, 'Ponto de coleta nao encontrado.');
  return r.rows[0];
}

async function criar({ nome_local, endereco, cidade, id_empresa }) {
  const r = await db.query(
    `INSERT INTO pontos_coleta (nome_local, endereco, cidade, id_empresa)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nome_local, endereco, cidade, id_empresa]
  );
  return r.rows[0];
}

async function atualizar(id, { nome_local, endereco, cidade, id_empresa }) {
  const r = await db.query(
    `UPDATE pontos_coleta
        SET nome_local = COALESCE($2, nome_local),
            endereco = COALESCE($3, endereco),
            cidade = COALESCE($4, cidade),
            id_empresa = COALESCE($5, id_empresa)
      WHERE id_ponto = $1 RETURNING *`,
    [id, nome_local, endereco, cidade, id_empresa]
  );
  if (r.rows.length === 0) throw new ErroApi(404, 'Ponto de coleta nao encontrado.');
  return r.rows[0];
}

async function remover(id) {
  const r = await db.query(
    'DELETE FROM pontos_coleta WHERE id_ponto = $1 RETURNING id_ponto',
    [id]
  );
  if (r.rows.length === 0) throw new ErroApi(404, 'Ponto de coleta nao encontrado.');
  return { id_ponto: r.rows[0].id_ponto };
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
