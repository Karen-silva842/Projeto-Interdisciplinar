const Loja = require('../models/loja');
const Fornecedor = require('../models/fornecedor');
const Usuario = require('../models/usuario');
const { generateCredentials, generateTempEmail } = require('../utils/gerarCredenciais');

class AdministradoresController {
  static async cadastrarLoja(req, res) {
    try {
      const lojaData = req.body;
      const credenciais = generateCredentials();
      const emailTemp = generateTempEmail(lojaData.nome);

      const usuario = await Usuario.criar({
        email: emailTemp,
        senha: credenciais.password,
        tipo: 'loja',
        nome: lojaData.nome
      });

      const loja = await Loja.criar({
        ...lojaData,
        usuario_id: usuario.id
      });

      res.status(201).json({
        success: true,
        message: 'Loja cadastrada com sucesso',
        data: { loja, credenciais: { email: usuario.email, senha: credenciais.password } }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao cadastrar loja', error: error.message });
    }
  }

  static async cadastrarFornecedor(req, res) {
    try {
      const fornecedorData = req.body;
      const credenciais = generateCredentials();
      const emailTemp = generateTempEmail(fornecedorData.nome);

      const usuario = await Usuario.criar({
        email: emailTemp,
        senha: credenciais.password,
        tipo: 'fornecedor',
        nome: fornecedorData.nome
      });

      const fornecedor = await Fornecedor.criar({
        ...fornecedorData,
        usuario_id: usuario.id
      });

      res.status(201).json({
        success: true,
        message: 'Fornecedor cadastrado com sucesso',
        data: { fornecedor, credenciais: { email: usuario.email, senha: credenciais.password } }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao cadastrar fornecedor', error: error.message });
    }
  }

  static async listarLojas(req, res) {
    try {
      const lojas = await Loja.listarTodas();
      res.json({ success: true, data: lojas });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao listar lojas', error: error.message });
    }
  }

  static async listarFornecedores(req, res) {
    try {
      const fornecedores = await Fornecedor.listarTodos();
      res.json({ success: true, data: fornecedores });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao listar fornecedores', error: error.message });
    }
  }

  static async gerarCredenciais(req, res) {
    try {
      const { usuario_id } = req.params;
      const credenciais = generateCredentials();
      res.json({ success: true, message: 'Credenciais geradas com sucesso', data: credenciais });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao gerar credenciais', error: error.message });
    }
  }
}

module.exports = AdministradoresController;
