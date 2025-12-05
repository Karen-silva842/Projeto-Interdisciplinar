const Campanha = require('../models/campanha');

class CampanhasController {
  static async listarAtivas(req, res) {
    try {
      const campanhas = await Campanha.buscarCampanhasAtivas();

      res.json({
        success: true,
        data: campanhas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar campanhas',
        error: error.message
      });
    }
  }

  static async listarFornecedor(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const campanhas = await Campanha.buscarPorFornecedor(fornecedorId);

      const campanhasData = campanhas.map((campanha) => ({
        ...campanha,
        produto: {
          id_produto: campanha.produto_id,
          nome: campanha.produto_nome
        }
      }))

      res.json({
        success: true,
        data: campanhasData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar campanhas',
        error: error.message
      });
    }
  }

  static async criar(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;

      const campanhaData = {
        ...req.body,
        fornecedor_id: fornecedorId
      };

      const campanha = await Campanha.criar(campanhaData);

      res.status(201).json({
        success: true,
        message: 'Campanha criada com sucesso',
        data: campanha
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar campanha',
        error: error.message
      });
    }
  }

  static async atualizar(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const { id } = req.params;

      const campanhas = await Campanha.buscarPorFornecedor(fornecedorId);
      const campanhaExistente = campanhas.find(c => c.id === parseInt(id));

      if (!campanhaExistente) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a esta campanha'
        });
      }

      const campanhaAtualizada = await Campanha.atualizar(id, req.body);

      res.json({
        success: true,
        message: 'Campanha atualizada com sucesso',
        data: campanhaAtualizada
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar campanha',
        error: error.message
      });
    }
  }

  static async excluir(req, res) {
    try {
      const fornecedorId = req.usuario.perfil_id;
      const { id } = req.params;

      const campanhas = await Campanha.buscarPorFornecedor(fornecedorId);
      const campanhaExistente = campanhas.find(c => c.id_campanha === parseInt(id));

      if (!campanhaExistente) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a esta campanha'
        });
      }

      await Campanha.excluir(id);

      res.json({
        success: true,
        message: 'Campanha excluída com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir campanha',
        error: error.message
      });
    }
  }
}

module.exports = CampanhasController;
