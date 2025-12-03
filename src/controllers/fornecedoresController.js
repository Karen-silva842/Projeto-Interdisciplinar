const Fornecedor = require('../models/fornecedor');
const Produto = require('../models/produto');
const Pedido = require('../models/pedido');
const Campanha = require('../models/campanha');
const CondicaoComercial = require('../models/condicaoComercial');

class FornecedoresController {
  static async getPerfil(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const fornecedor = await Fornecedor.buscarPorId(fornecedorId);

      res.json({
        success: true,
        data: fornecedor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar perfil do fornecedor',
        error: error.message
      });
    }
  }

  static async listarPedidos(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const pedidos = await Pedido.buscarPorFornecedor(fornecedorId);

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

  static async atualizarStatusPedido(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const { id } = req.params;
      const { status } = req.body;

      const pedido = await Pedido.buscarPorId(id);

      if (!pedido || pedido.fornecedor_id !== fornecedorId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a este pedido'
        });
      }

      const pedidoAtualizado = await Pedido.atualizarStatus(id, status);

      res.json({
        success: true,
        message: 'Status do pedido atualizado com sucesso',
        data: pedidoAtualizado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar status do pedido',
        error: error.message
      });
    }
  }

  static async listarProdutos(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const produtos = await Produto.buscarPorFornecedor(fornecedorId);

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

  static async cadastrarProduto(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const produtoData = { ...req.body, fornecedor_id: fornecedorId };

      const produto = await Produto.criar(produtoData);

      res.status(201).json({
        success: true,
        message: 'Produto cadastrado com sucesso',
        data: produto
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao cadastrar produto',
        error: error.message
      });
    }
  }

  static async atualizarProduto(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const { id } = req.params;

      const produto = await Produto.buscarPorId(id);

      if (!produto || produto.fornecedor_id !== fornecedorId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a este produto'
        });
      }

      const produtoAtualizado = await Produto.atualizar(id, req.body);

      res.json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: produtoAtualizado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar produto',
        error: error.message
      });
    }
  }

  static async excluirProduto(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const { id } = req.params;

      const produto = await Produto.buscarPorId(id);

      if (!produto || produto.fornecedor_id !== fornecedorId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a este produto'
        });
      }

      await Produto.excluir(id);

      res.json({
        success: true,
        message: 'Produto excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir produto',
        error: error.message
      });
    }
  }
}

module.exports = FornecedoresController;
