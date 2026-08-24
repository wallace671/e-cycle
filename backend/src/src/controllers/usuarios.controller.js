// ============================================================
// Controller de USUARIOS
// ============================================================
const service = require('../services/usuarios.service');
const { validarUsuario } = require('../middlewares/validacao');

async function listar(req, res, next) {
  try {
    res.json(await service.listar());
  } catch (e) { next(e); }
}

async function buscar(req, res, next) {
  try {
    res.json(await service.buscarPorId(req.params.id));
  } catch (e) { next(e); }
}

async function criar(req, res, next) {
  try {
    const erros = validarUsuario(req.body);
    if (erros.length) return res.status(400).json({ erros });
    const novo = await service.criar(req.body);
    res.status(201).json(novo);
  } catch (e) { next(e); }
}

async function atualizar(req, res, next) {
  try {
    res.json(await service.atualizar(req.params.id, req.body));
  } catch (e) { next(e); }
}

async function remover(req, res, next) {
  try {
    res.json(await service.remover(req.params.id));
  } catch (e) { next(e); }
}

module.exports = { listar, buscar, criar, atualizar, remover };
