const Loja = require('../models/loja');
const Fornecedor = require('../models/fornecedor');
const Pedido = require('../models/pedido');
const Produto = require('../models/produto');

class LojasController {
  static async getPerfil(req, res) {
    try {
      const lojaId = req.usuario.perfil_id;
      const loja = await Loja.buscarPorId(lojaId);

      res.json({
        success: true,
        data: loja
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar perfil da loja',
        error: error.message
      });
    }
  }

  static async atualizarPerfil(req, res) {
    try {
      const lojaId = req.usuario.perfil_id;
      const lojaData = req.body;

      const lojaAtualizada = await Loja.atualizar(lojaId, lojaData);

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: lojaAtualizada
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar perfil',
        error: error.message
      });
    }
  }

  static async listarFornecedores(req, res) {
    try {
      const { categoria_id } = req.query;
      let fornecedores;

      if (categoria_id) {
        fornecedores = await Fornecedor.buscarPorCategoria(categoria_id);
      } else {
        fornecedores = await Fornecedor.listarTodos();
      }

      res.json({
        success: true,
        data: fornecedores
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar fornecedores',
        error: error.message
      });
    }
  }

  static async listarProdutos(req, res) {
    try {
      const { categoria_id } = req.query;
      let produtos;

      if (categoria_id) {
        produtos = await Produto.buscarPorCategoria(categoria_id);
      } else {
        produtos = [];
      }

      res.json({
        success: true,
        data: produtos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar produtos',
        error: error.message
      });
    }
  }

  static async criarPedido(req, res) {
    try {
      const lojaId = req.usuario.perfil_id;
      const pedidoData = {
        ...req.body,
        loja_id: lojaId
      };

      const pedido = await Pedido.criar(pedidoData);

      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso',
        data: pedido
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar pedido',
        error: error.message
      });
    }
  }

  static async listarPedidos(req, res) {
    try {
      const lojaId = req.usuario.perfil_id;
      const pedidos = await Pedido.buscarPorLoja(lojaId);

      res.json({
        success: true,
        data: pedidos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar pedidos',
        error: error.message
      });
    }
  }

  static async buscarPedido(req, res) {
    try {
      const { id } = req.params;
      const pedido = await Pedido.buscarPorId(id);

      if (pedido.loja_id !== req.usuario.perfil_id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a este pedido'
        });
      }

      res.json({
        success: true,
        data: pedido
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar pedido',
        error: error.message
      });
    }
  }
}

module.exports = LojasController;
