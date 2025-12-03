const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const pool = require('./src/db');
const connectMongoDB = require('./src/mongodb');

// Testar PostgreSQL
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("PostgreSQL conectado:", res.rows[0].now);
  } catch (err) {
    console.error("Erro ao conectar ao PostgreSQL:", err.message);
  }
})();

// Conectar MongoDB
connectMongoDB();

const { swaggerUi, specs } = require('./swagger/swagger');

const administradoresRoutes = require('./routes/administradores');
const usuariosRoutes = require('./routes/usuarios');
const lojasRoutes = require('./routes/lojas');
const fornecedoresRoutes = require('./routes/fornecedores');
const produtosRoutes = require('./routes/produtos');
const pedidosRoutes = require('./routes/pedidos');
const campanhasRoutes = require('./routes/campanhas');
const condicoesRoutes = require('./routes/condicoes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS para o frontend
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos do frontend
app.use(express.static(path.join(__dirname, 'public')));

// Log das requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: 'ONLINE',
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/api/administradores', administradoresRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/lojas', lojasRoutes);
app.use('/api/fornecedores', fornecedoresRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/campanhas', campanhasRoutes);
app.use('/api/condicoes', condicoesRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Central de Compras - API Docs'
}));

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/*  
======================================================
FALLBACK DE SPA SEM USAR '*' (AGORA COMPATÍVEL COM EXPRESS 5)
======================================================
*/

// Se NÃO começa com /api → é frontend → devolve index.html
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  next();
});

// Se for /api e nenhuma rota foi encontrada
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Handler global de erros
app.use((err, req, res, next) => {
  console.error("Erro global:", err);

  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;
