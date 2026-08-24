// ============================================================
// Controller de PONTOS DE COLETA
// ============================================================
const service = require('../services/pontos.service');
const { validarPonto } = require('../middlewares/validacao');

async function listar(req, res, next) {
  try { res.json(await service.listar()); } catch (e) { next(e); }
}
async function buscar(req, res, next) {
  try { res.json(await service.buscarPorId(req.params.id)); } catch (e) { next(e); }
}
async function criar(req, res, next) {
  try {
    const erros = validarPonto(req.body);
    if (erros.length) return res.status(400).json({ erros });
    res.status(201).json(await service.criar(req.body));
  } catch (e) { next(e); }
}
async function atualizar(req, res, next) {
  try { res.json(await service.atualizar(req.params.id, req.body)); } catch (e) { next(e); }
}
async function remover(req, res, next) {
  try { res.json(await service.remover(req.params.id)); } catch (e) { next(e); }
}

module.exports = { listar, buscar, criar, atualizar, remover };
