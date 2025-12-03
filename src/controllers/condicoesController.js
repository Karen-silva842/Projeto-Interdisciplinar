const CondicaoComercial = require('../models/condicaoComercial');

class CondicoesController {
  static async listar(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const condicoes = await CondicaoComercial.buscarPorFornecedor(fornecedorId);

      res.json({
        success: true,
        data: condicoes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar condições comerciais',
        error: error.message
      });
    }
  }

  static async criar(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const condicaoData = {
        ...req.body,
        fornecedor_id: fornecedorId
      };

      const condicao = await CondicaoComercial.criar(condicaoData);

      res.status(201).json({
        success: true,
        message: 'Condição comercial criada com sucesso',
        data: condicao
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar condição comercial',
        error: error.message
      });
    }
  }

  static async atualizar(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const { id } = req.params;

      const condicoes = await CondicaoComercial.buscarPorFornecedor(fornecedorId);
      const condicaoExistente = condicoes.find(c => c.id === parseInt(id));

      if (!condicaoExistente) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a esta condição comercial'
        });
      }

      const condicaoAtualizada = await CondicaoComercial.atualizar(id, req.body);

      res.json({
        success: true,
        message: 'Condição comercial atualizada com sucesso',
        data: condicaoAtualizada
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar condição comercial',
        error: error.message
      });
    }
  }

  static async excluir(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const { id } = req.params;

      const condicoes = await CondicaoComercial.buscarPorFornecedor(fornecedorId);
      const condicaoExistente = condicoes.find(c => c.id === parseInt(id));

      if (!condicaoExistente) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a esta condição comercial'
        });
      }

      await CondicaoComercial.excluir(id);

      res.json({
        success: true,
        message: 'Condição comercial excluída com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir condição comercial',
        error: error.message
      });
    }
  }
}

module.exports = CondicoesController;
