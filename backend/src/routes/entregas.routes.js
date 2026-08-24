const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/entregas.controller');
const { apenasAdmin } = require('../middlewares/auth');

// Cliente (logado) solicita o proprio descarte.
router.post('/', ctrl.solicitar);

// Admin: fila de pendentes, historico, confirmar e recusar.
router.get('/pendentes', apenasAdmin, ctrl.pendentes);
router.get('/', apenasAdmin, ctrl.listar);
router.put('/:id/confirmar', apenasAdmin, ctrl.confirmar);
router.put('/:id/recusar', apenasAdmin, ctrl.recusar);

module.exports = router;
