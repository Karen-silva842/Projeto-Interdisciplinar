const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  usuario_id: {
    type: Number,
    required: true
  },
  tipo_usuario: {
    type: String,
    enum: ['admin', 'loja', 'fornecedor'],
    required: true
  },
  acao: {
    type: String,
    required: true
  },
  entidade: {
    type: String,
    required: true
  },
  entidade_id: {
    type: Number
  },
  dados_anteriores: {
    type: mongoose.Schema.Types.Mixed
  },
  dados_novos: {
    type: mongoose.Schema.Types.Mixed
  },
  ip: {
    type: String
  },
  user_agent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'logs',
  timestamps: true
});

// Índices para otimizar consultas
logSchema.index({ usuario_id: 1, timestamp: -1 });
logSchema.index({ entidade: 1, entidade_id: 1 });
logSchema.index({ timestamp: -1 });

const Log = mongoose.model('Log', logSchema);

module.exports = Log;

// ====================================
// EXEMPLO DE USO
// ====================================

// Criar log
/*
const Log = require('./models/Log');

async function criarLog(req, acao, entidade, entidade_id, dados) {
  try {
    await Log.create({
      usuario_id: req.user.id,
      tipo_usuario: req.user.tipo,
      acao: acao,
      entidade: entidade,
      entidade_id: entidade_id,
      dados_novos: dados,
      ip: req.ip,
      user_agent: req.get('user-agent')
    });
  } catch (error) {
    console.error('Erro ao criar log:', error);
  }
}

// Em uma rota:
app.post('/api/lojas', auth, async (req, res) => {
  try {
    // ... criar loja no PostgreSQL
    const novaLoja = await criarLojaNoPostgres(req.body);
    
    // Registrar no MongoDB
    await criarLog(req, 'CREATE', 'loja', novaLoja.id, req.body);
    
    res.json({ success: true, data: novaLoja });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
*/