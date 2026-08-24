// ============================================================
// Service de PERFIL — dados do PROPRIO usuario logado.
// Sempre usa o id vindo do token (nunca do corpo da requisicao).
// ============================================================
const db = require('../config/db');

// Info do usuario + pontuacao acumulada.
async function meusDados(idUsuario) {
  const usuario = await db.query(
    'SELECT id_usuario, nome, email, telefone, tipo_usuario FROM usuarios WHERE id_usuario = $1',
    [idUsuario]
  );
  const pont = await db.query(
    'SELECT pontos, nivel FROM pontuacao WHERE id_usuario = $1',
    [idUsuario]
  );
  return {
    usuario: usuario.rows[0],
    pontuacao: pont.rows[0] || { pontos: 0, nivel: 1 },
  };
}

// Historico de entregas do proprio usuario.
async function minhasEntregas(idUsuario) {
  const r = await db.query(
    `SELECT e.id_entrega, e.peso_residuo, e.status, e.data_entrega,
            pc.nome_local, tr.nome AS nome_tipo
       FROM entregas e
       JOIN pontos_coleta pc ON pc.id_ponto = e.id_ponto
       JOIN tipos_residuo tr ON tr.id_tipo  = e.id_tipo
      WHERE e.id_usuario = $1
      ORDER BY e.data_entrega DESC`,
    [idUsuario]
  );
  return r.rows;
}

module.exports = { meusDados, minhasEntregas };
