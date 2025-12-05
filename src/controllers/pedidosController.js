const Pedido = require('../models/pedido');
const ItensPedido = require('../models/itensPedido');
const AplicadorCondicoes = require('../utils/aplicadorCondicoes');

class PedidosController {
  static async criarPedido(req, res) {
    try {
      const dadosPedido = req.body;
      const novoPedido = await Pedido.criar(dadosPedido);

      res.status(201).json({
        success: true,
        data: novoPedido
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar pedido',
        error: error.message
      });
    }
  }

  static async getByLoja(req, res) {
    try {
      const { lojaId } = req.params;
      const pedidos = await Pedido.buscarPorLoja(lojaId);

      res.json({
        success: true,
        data: pedidos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar pedidos da loja',
        error: error.message
      });
    }
  }

  static async buscarPorFornecedor(req, res) {
    try {
      const usuario = req.usuario;
      const fornecedor = usuario ? usuario.perfil_id : null
        if (fornecedor) {
        const pedidos = await Pedido.buscarPorFornecedor(fornecedor);
        
        for (let pedido of pedidos) {
          pedido.itens = await ItensPedido.buscarPorPedido(pedido.id_pedido);
        }

        res.json({
          success: true,
          data: pedidos
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar pedidos do fornecedor',
        error: error.message
      });
    }
  }

  static async atualizarStatusPedido(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const pedidoAtualizado = await Pedido.atualizarStatus(id, status);

      res.json({
        success: true,
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

  static async calcularCondicoes(req, res) {
    try {
      const { fornecedor_id, estado_loja, itens, valor_total } = req.body;

      const resultado = await AplicadorCondicoes.aplicarCondicoesEstado({
        fornecedor_id,
        estado_loja,
        itens,
        valor_total
      });

      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao calcular condições comerciais',
        error: error.message
      });
    }
  }

  static async buscarItensPedido(req, res) {
    try {
      const { id } = req.params;
      const itens = await ItensPedido.buscarPorPedido(id);

      res.json({
        success: true,
        data: itens
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar itens do pedido',
        error: error.message
      });
    }
  }

  static async detalhesPedido(req, res) {
    try {
      const { id } = req.params;
      const pedido = await Pedido.buscarPorId(id);
      const itens = await ItensPedido.buscarPorPedido(id);

      res.json({
        success: true,
        data: {
          pedido,
          itens
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar detalhes do pedido',
        error: error.message
      });
    }
  }
}

module.exports = PedidosController;
