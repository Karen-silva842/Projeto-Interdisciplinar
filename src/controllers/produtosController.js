const Produto = require('../models/produto');

class ProdutosController {
  static async listarTodos(req, res) {
    try {
      const { categoria_id, fornecedor_id, pagina = 1, limite = 10 } = req.query;

      let produtos = [];

      if (categoria_id) {
        produtos = await Produto.buscarPorCategoria(categoria_id);
      } else if (fornecedor_id) {
        produtos = await Produto.buscarPorFornecedor(fornecedor_id);
      } else {
        produtos = [];
      }

      res.json({
        success: true,
        data: produtos,
        paginacao: {
          pagina: parseInt(pagina),
          limite: parseInt(limite),
          total: produtos.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar produtos',
        error: error.message
      });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const produto = await Produto.buscarPorId(id);

      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      res.json({
        success: true,
        data: produto
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produto',
        error: error.message
      });
    }
  }

  static async buscar(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Termo de busca é obrigatório'
        });
      }

      res.json({
        success: true,
        data: [], 
        message: 'Funcionalidade de busca em desenvolvimento'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produtos',
        error: error.message
      });
    }
  }
}

module.exports = ProdutosController;
