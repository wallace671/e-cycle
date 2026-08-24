const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuarios.controller');
const { apenasAdmin } = require('../middlewares/auth');

// Gestao de usuarios: somente admin.
router.get('/', apenasAdmin, ctrl.listar);
router.get('/:id', apenasAdmin, ctrl.buscar);
router.post('/', apenasAdmin, ctrl.criar);
router.put('/:id', apenasAdmin, ctrl.atualizar);
router.delete('/:id', apenasAdmin, ctrl.remover);

module.exports = router;
