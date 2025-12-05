const db = require('../db');

class ItensPedido {

  static async buscarPorPedido(pedidoId) {
    const query = `
      SELECT 
        ip.*, 
        p.nome AS produto_nome
      FROM itens_pedido ip
      JOIN produtos p ON ip.produto_id = p.id_produto
      WHERE ip.pedido_id = $1
      ORDER BY ip.id_itens
    `;
    const result = await db.query(query, [pedidoId]);
    return result.rows;
  }

  static async buscarPorProduto(produtoId) {
    const query = `
      SELECT 
        ip.*,
        ped.loja_id,
        ped.fornecedor_id,
        ped.status
      FROM itens_pedido ip
      JOIN pedidos ped ON ip.pedido_id = ped.id_pedido
      WHERE ip.produto_id = $1
      ORDER BY ip.criado_em DESC
    `;
    const result = await db.query(query, [produtoId]);
    return result.rows;
  }

  static async atualizarQuantidade(itemId, quantidade) {
    const query = `
      UPDATE itens_pedido
      SET 
        quantidade = $1,
        valor_total = quantidade * preco_unitario,
        atualizado_em = NOW()
      WHERE id_itens = $2
      RETURNING *
    `;
    const result = await db.query(query, [quantidade, itemId]);
    return result.rows[0];
  }
}

module.exports = ItensPedido;
