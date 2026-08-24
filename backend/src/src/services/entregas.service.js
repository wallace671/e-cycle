// ============================================================
// Service de ENTREGAS (o "descarte") + GAMIFICACAO
//
// Fluxo:
//   1) cliente SOLICITA -> status 'solicitado' (NAO pontua)
//   2) admin do ponto CONFIRMA -> status 'confirmado' + gera pontos
//      (ou RECUSA -> status 'recusado')
//
// Regras de gamificacao (so aplicadas na confirmacao):
//   pontos = peso * 10  |  nivel = floor(pontos/100) + 1
// ============================================================
const db = require('../config/db');
const { ErroApi } = require('../middlewares/erro');

const PONTOS_POR_KG = 10;
const PONTOS_POR_NIVEL = 100;
const calcularPontos = (peso) => Math.round(Number(peso) * PONTOS_POR_KG);
const calcularNivel = (total) => Math.floor(total / PONTOS_POR_NIVEL) + 1;

// SELECT base com os nomes (JOINs), usado nas listagens.
const SELECT_BASE = `
  SELECT e.id_entrega, e.peso_residuo, e.status, e.data_entrega, e.data_confirmacao,
         u.id_usuario, u.nome AS nome_usuario,
         pc.id_ponto, pc.nome_local,
         tr.id_tipo, tr.nome AS nome_tipo
    FROM entregas e
    JOIN usuarios u       ON u.id_usuario = e.id_usuario
    JOIN pontos_coleta pc ON pc.id_ponto  = e.id_ponto
    JOIN tipos_residuo tr ON tr.id_tipo   = e.id_tipo`;

// Cliente solicita o descarte (sem pontuar).
async function solicitar({ id_usuario, id_ponto, id_tipo, peso_residuo }) {
  const r = await db.query(
    `INSERT INTO entregas (id_usuario, id_ponto, id_tipo, peso_residuo, status)
     VALUES ($1, $2, $3, $4, 'solicitado')
     RETURNING id_entrega, peso_residuo, status, data_entrega`,
    [id_usuario, id_ponto, id_tipo, peso_residuo]
  );
  return r.rows[0];
}

// Lista solicitacoes PENDENTES. Se filtroPonto for informado
// (admin de ponto), so as do ponto dele.
async function listarPendentes(filtroPonto) {
  const where = filtroPonto
    ? `WHERE e.status = 'solicitado' AND e.id_ponto = $1`
    : `WHERE e.status = 'solicitado'`;
  const params = filtroPonto ? [filtroPonto] : [];
  const r = await db.query(`${SELECT_BASE} ${where} ORDER BY e.data_entrega ASC`, params);
  return r.rows;
}

// Historico geral (todos os status). filtroPonto opcional.
async function listar(filtroPonto) {
  const where = filtroPonto ? `WHERE e.id_ponto = $1` : '';
  const params = filtroPonto ? [filtroPonto] : [];
  const r = await db.query(`${SELECT_BASE} ${where} ORDER BY e.data_entrega DESC`, params);
  return r.rows;
}

// Busca uma entrega (para checagens).
async function buscar(id) {
  const r = await db.query('SELECT * FROM entregas WHERE id_entrega = $1', [id]);
  if (r.rows.length === 0) throw new ErroApi(404, 'Descarte nao encontrado.');
  return r.rows[0];
}

// Admin do ponto CONFIRMA -> gera a pontuacao (transacao).
// adminIdPonto: se o admin for de ponto, so pode confirmar do proprio ponto.
async function confirmar(idEntrega, adminIdPonto) {
  const entrega = await buscar(idEntrega);
  if (entrega.status !== 'solicitado')
    throw new ErroApi(409, `Este descarte ja foi ${entrega.status}.`);
  if (adminIdPonto && entrega.id_ponto !== adminIdPonto)
    throw new ErroApi(403, 'Este descarte e de outro ponto de coleta.');

  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    await client.query(
      `UPDATE entregas SET status = 'confirmado', data_confirmacao = NOW() WHERE id_entrega = $1`,
      [idEntrega]
    );
    const pontosGanhos = calcularPontos(entrega.peso_residuo);
    const upsert = await client.query(
      `INSERT INTO pontuacao (id_usuario, pontos, nivel)
       VALUES ($1, $2, 1)
       ON CONFLICT (id_usuario)
       DO UPDATE SET pontos = pontuacao.pontos + EXCLUDED.pontos
       RETURNING pontos`,
      [entrega.id_usuario, pontosGanhos]
    );
    const pontosTotais = upsert.rows[0].pontos;
    const nivel = calcularNivel(pontosTotais);
    await client.query(
      `UPDATE pontuacao SET nivel = $2, data_registro = NOW() WHERE id_usuario = $1`,
      [entrega.id_usuario, nivel]
    );
    await client.query('COMMIT');
    return { id_entrega: idEntrega, status: 'confirmado',
             gamificacao: { pontos_ganhos: pontosGanhos, pontos_totais: pontosTotais, nivel } };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Admin do ponto RECUSA (sem pontuar).
async function recusar(idEntrega, adminIdPonto) {
  const entrega = await buscar(idEntrega);
  if (entrega.status !== 'solicitado')
    throw new ErroApi(409, `Este descarte ja foi ${entrega.status}.`);
  if (adminIdPonto && entrega.id_ponto !== adminIdPonto)
    throw new ErroApi(403, 'Este descarte e de outro ponto de coleta.');
  await db.query(`UPDATE entregas SET status = 'recusado' WHERE id_entrega = $1`, [idEntrega]);
  return { id_entrega: idEntrega, status: 'recusado' };
}

module.exports = { solicitar, listarPendentes, listar, confirmar, recusar };
