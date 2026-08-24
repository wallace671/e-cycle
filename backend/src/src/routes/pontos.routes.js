const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pontos.controller');
const { apenasAdmin } = require('../middlewares/auth');

// Listar/buscar: qualquer logado (o cliente precisa para escolher no descarte).
router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscar);
// Gestao: so admin.
router.post('/', apenasAdmin, ctrl.criar);
router.put('/:id', apenasAdmin, ctrl.atualizar);
router.delete('/:id', apenasAdmin, ctrl.remover);

module.exports = router;
