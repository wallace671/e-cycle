const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/relatorios.controller');
const { apenasAdmin } = require('../middlewares/auth');

// Relatorios: somente admin.
router.get('/totais', apenasAdmin, ctrl.totais);
router.get('/ranking', apenasAdmin, ctrl.ranking);
router.get('/pontos', apenasAdmin, ctrl.pontos);
router.get('/tipos', apenasAdmin, ctrl.tipos);

module.exports = router;
