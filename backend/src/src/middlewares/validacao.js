// ============================================================
// Funcoes de validacao de dados de entrada.
// Retornam uma lista de erros (vazia = tudo certo).
// ============================================================

function ehTextoValido(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function ehEmailValido(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function ehNumeroPositivo(v) {
  return !isNaN(v) && Number(v) > 0;
}

function ehInteiro(v) {
  return Number.isInteger(Number(v));
}

// Valida o corpo de criacao de usuario.
function validarUsuario(body) {
  const erros = [];
  if (!ehTextoValido(body.nome)) erros.push('nome e obrigatorio');
  if (!ehEmailValido(body.email)) erros.push('email invalido');
  if (!ehTextoValido(body.senha) || body.senha.length < 6)
    erros.push('senha deve ter ao menos 6 caracteres');
  return erros;
}

function validarEmpresa(body) {
  const erros = [];
  if (!ehTextoValido(body.nome_empresa)) erros.push('nome_empresa e obrigatorio');
  if (!ehTextoValido(body.cnpj)) erros.push('cnpj e obrigatorio');
  return erros;
}

function validarTipo(body) {
  const erros = [];
  if (!ehTextoValido(body.nome)) erros.push('nome e obrigatorio');
  return erros;
}

function validarPonto(body) {
  const erros = [];
  if (!ehTextoValido(body.nome_local)) erros.push('nome_local e obrigatorio');
  if (!ehTextoValido(body.endereco)) erros.push('endereco e obrigatorio');
  if (!ehTextoValido(body.cidade)) erros.push('cidade e obrigatorio');
  if (!ehInteiro(body.id_empresa)) erros.push('id_empresa e obrigatorio');
  return erros;
}

function validarEntrega(body) {
  const erros = [];
  if (!ehInteiro(body.id_usuario)) erros.push('id_usuario e obrigatorio');
  if (!ehInteiro(body.id_ponto)) erros.push('id_ponto e obrigatorio');
  if (!ehInteiro(body.id_tipo)) erros.push('id_tipo e obrigatorio');
  if (!ehNumeroPositivo(body.peso_residuo)) erros.push('peso_residuo deve ser maior que zero');
  return erros;
}

module.exports = {
  validarUsuario,
  validarEmpresa,
  validarTipo,
  validarPonto,
  validarEntrega,
};
