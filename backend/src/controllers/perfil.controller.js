// ============================================================
// Controller de PERFIL
// ============================================================
const service = require('../services/perfil.service');

async function meusDados(req, res, next) {
  try {
    // req.usuario.id vem do token (middleware autenticar)
    res.json(await service.meusDados(req.usuario.id));
  } catch (e) { next(e); }
}

async function minhasEntregas(req, res, next) {
  try {
    res.json(await service.minhasEntregas(req.usuario.id));
  } catch (e) { next(e); }
}

module.exports = { meusDados, minhasEntregas };
