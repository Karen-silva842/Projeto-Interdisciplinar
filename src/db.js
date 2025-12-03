require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || "localhost", 
  port: process.env.DB_PORT || 5433, 
  database: process.env.DB_NAME,
  ssl: false 
});

pool.connect()
  .then(client => {
    console.log("Conectado ao PostgreSQL com sucesso!");
    client.release(); 
  })
  .catch(err => {
    console.error("Erro ao conectar ao PostgreSQL:", err.message);
  });

module.exports = pool;