// ============================================================
// Conexao com o banco (Supabase / PostgreSQL)
// Usamos a biblioteca "pg" com um Pool de conexoes.
// O Supabase e apenas o banco: todo o CRUD e feito com SQL aqui.
// ============================================================
const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.warn('[db] Atencao: DATABASE_URL nao definida. Configure o arquivo .env.');
}

// O Supabase exige SSL (padrao). Para testar com um Postgres LOCAL,
// coloque DB_SSL=false no .env.
const usarSSL = process.env.DB_SSL !== 'false';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: usarSSL ? { rejectUnauthorized: false } : false,
});

// Helper: executa uma query e devolve o resultado.
// Ex.: const r = await db.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
async function query(texto, params) {
  return pool.query(texto, params);
}

// Helper: pega um cliente do pool para usar transacoes (BEGIN/COMMIT).
async function getClient() {
  return pool.connect();
}

module.exports = { query, getClient, pool };
