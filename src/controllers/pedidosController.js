const Pedido = require('../models/pedido');
const ItensPedido = require('../models/itensPedido');
const AplicadorCondicoes = require('../utils/aplicadorCondicoes');

class PedidosController {
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
