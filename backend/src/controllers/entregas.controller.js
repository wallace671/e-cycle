// ============================================================
// Controller de ENTREGAS
// ============================================================
const service = require('../services/entregas.service');
const { validarEntrega } = require('../middlewares/validacao');

// Cliente solicita o proprio descarte (id_usuario vem do TOKEN).
async function solicitar(req, res, next) {
  try {
    const dados = {
      id_usuario: req.usuario.id,
      id_ponto: req.body.id_ponto,
      id_tipo: req.body.id_tipo,
      peso_residuo: req.body.peso_residuo,
    };
    const erros = validarEntrega(dados);
    if (erros.length) return res.status(400).json({ erros });
    res.status(201).json(await service.solicitar(dados));
  } catch (e) { next(e); }
}

// Admin do ponto ve so o proprio ponto; admin global ve tudo.
function pontoDoAdmin(req) {
  return req.usuario.id_ponto || null; // null = admin global
}

async function pendentes(req, res, next) {
  try { res.json(await service.listarPendentes(pontoDoAdmin(req))); } catch (e) { next(e); }
}

async function listar(req, res, next) {
  try { res.json(await service.listar(pontoDoAdmin(req))); } catch (e) { next(e); }
}

async function confirmar(req, res, next) {
  try { res.json(await service.confirmar(req.params.id, pontoDoAdmin(req))); } catch (e) { next(e); }
}

async function recusar(req, res, next) {
  try { res.json(await service.recusar(req.params.id, pontoDoAdmin(req))); } catch (e) { next(e); }
}

module.exports = { solicitar, pendentes, listar, confirmar, recusar };
