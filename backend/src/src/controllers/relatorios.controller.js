// ============================================================
// Controller de RELATORIOS
// ============================================================
const service = require('../services/relatorios.service');

async function totais(req, res, next) {
  try { res.json(await service.totaisColetados()); } catch (e) { next(e); }
}
async function ranking(req, res, next) {
  try { res.json(await service.usuariosQueMaisReciclam()); } catch (e) { next(e); }
}
async function pontos(req, res, next) {
  try { res.json(await service.pontosMaisUtilizados()); } catch (e) { next(e); }
}
async function tipos(req, res, next) {
  try { res.json(await service.tiposMaisDescartados()); } catch (e) { next(e); }
}

module.exports = { totais, ranking, pontos, tipos };
