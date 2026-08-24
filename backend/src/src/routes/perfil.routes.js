// Rotas do proprio usuario logado (qualquer perfil autenticado).
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/perfil.controller');

router.get('/', ctrl.meusDados);          // meus dados + pontuacao
router.get('/entregas', ctrl.minhasEntregas); // meu historico

module.exports = router;
