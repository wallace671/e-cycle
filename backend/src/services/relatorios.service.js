// ============================================================
// Service de RELATORIOS (ETAPA 6)
// As mesmas consultas de banco/03_consultas_relatorios.sql.
// ============================================================
const db = require('../config/db');

// 1) Quantidade de residuos coletados (total geral)
async function totaisColetados() {
  const r = await db.query(
    `SELECT COUNT(*) AS total_entregas,
            COALESCE(SUM(peso_residuo), 0) AS peso_total_kg
       FROM entregas`
  );
  return r.rows[0];
}

// 2) Usuarios que mais reciclam (ranking)
async function usuariosQueMaisReciclam() {
  const r = await db.query(
    `SELECT u.id_usuario, u.nome,
            COALESCE(p.pontos, 0) AS pontos,
            COALESCE(p.nivel, 1)  AS nivel,
            COUNT(e.id_entrega)   AS total_entregas,
            COALESCE(SUM(e.peso_residuo), 0) AS peso_total_kg
       FROM usuarios u
       LEFT JOIN pontuacao p ON p.id_usuario = u.id_usuario
       LEFT JOIN entregas  e ON e.id_usuario = u.id_usuario
      GROUP BY u.id_usuario, u.nome, p.pontos, p.nivel
      ORDER BY pontos DESC, peso_total_kg DESC`
  );
  return r.rows;
}

// 3) Pontos de coleta mais utilizados
async function pontosMaisUtilizados() {
  const r = await db.query(
    `SELECT pc.id_ponto, pc.nome_local, pc.cidade,
            COUNT(e.id_entrega) AS total_entregas,
            COALESCE(SUM(e.peso_residuo), 0) AS peso_total_kg
       FROM pontos_coleta pc
       LEFT JOIN entregas e ON e.id_ponto = pc.id_ponto
      GROUP BY pc.id_ponto, pc.nome_local, pc.cidade
      ORDER BY total_entregas DESC`
  );
  return r.rows;
}

// 4) Tipos de residuos mais descartados
async function tiposMaisDescartados() {
  const r = await db.query(
    `SELECT tr.id_tipo, tr.nome,
            COUNT(e.id_entrega) AS total_entregas,
            COALESCE(SUM(e.peso_residuo), 0) AS peso_total_kg
       FROM tipos_residuo tr
       LEFT JOIN entregas e ON e.id_tipo = tr.id_tipo
      GROUP BY tr.id_tipo, tr.nome
      ORDER BY total_entregas DESC`
  );
  return r.rows;
}

module.exports = {
  totaisColetados,
  usuariosQueMaisReciclam,
  pontosMaisUtilizados,
  tiposMaisDescartados,
};
