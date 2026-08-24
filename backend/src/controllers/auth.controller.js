// ============================================================
// Controller de AUTENTICACAO
// ============================================================
const service = require('../services/auth.service');
const { validarUsuario } = require('../middlewares/validacao');

async function registrar(req, res, next) {
  try {
    const erros = validarUsuario(req.body);
    if (erros.length) return res.status(400).json({ erros });
    const resultado = await service.registrar(req.body);
    res.status(201).json(resultado);
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: 'Informe email e senha.' });
    const resultado = await service.login({ email, senha });
    res.json(resultado);
  } catch (e) { next(e); }
}

module.exports = { registrar, login };
