const db = require('../db');

class Pedido {
  static async criar(pedidoData) {
    const {
      loja_id,
      itens,
      total: valor_total,
    } = pedidoData;

    try {
      await db.query('BEGIN');

      const pedidoQuery = `
        INSERT INTO pedidos (
          loja_id, valor_total, status, criado_em
        ) VALUES ($1, $2, 'pendente', NOW())
        RETURNING *
      `;

      const pedidoResult = await db.query(pedidoQuery, [
        loja_id, valor_total
      ]);

      const pedido = pedidoResult.rows[0];

      for (const item of itens) {
        const itemQuery = `
          INSERT INTO itens_pedido (
            pedido_id, produto_id, quantidade, preco_unitario
          ) VALUES ($1, $2, $3, $4)
        `;

        await db.query(itemQuery, [
          pedido.id_pedido,
          item.produto_id,
          item.quantidade,
          item.preco,
        ]);
      }

      await db.query('COMMIT');
      return pedido;

    } catch (error) {
      await db.query('ROLLBACK');
      throw error;

    }
  }

  static async buscarPorLoja(lojaId) {
    const query = `
      SELECT 
        p.*, 
        COUNT(ip.id_itens) AS quantidade_itens
      FROM pedidos p
      LEFT JOIN itens_pedido ip ON p.id_pedido = ip.pedido_id
      WHERE p.loja_id = $1
      GROUP BY p.id_pedido
      ORDER BY p.id_pedido DESC
    `;
    const result = await db.query(query, [lojaId]);
    return result.rows;
  }

  static async buscarPorFornecedor(fornecedorId) {
    const query = `
      SELECT 
        p.*, 
        l.nome AS loja_nome,
        COUNT(ip.id_itens) AS quantidade_itens
      FROM pedidos p
      JOIN lojas l ON p.loja_id = l.id
      JOIN itens_pedido ip ON p.id_pedido = ip.pedido_id
      JOIN produtos pr ON ip.produto_id = pr.id_produto
      WHERE pr.fornecedor_id = $1
      GROUP BY p.id_pedido, l.nome
      ORDER BY p.criado_em DESC
    `;
    const result = await db.query(query, [fornecedorId]);
    return result.rows;
  }

  static async buscarPorId(id) {
    const query = `
      SELECT 
        p.*, 
        l.nome AS loja_nome,
        f.nome AS fornecedor_nome
      FROM pedidos p
      JOIN lojas l ON p.loja_id = l.id_loja
      JOIN fornecedores f ON p.fornecedor_id = f.id
      WHERE p.id_pedido = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async atualizarStatus(pedidoId, status) {
    const statusPermitidos = [
      'pendente',
      'separado',
      'enviado',
      'entregue',
      'cancelado',
      'aprovado'
    ];

    if (!statusPermitidos.includes(status)) {
      throw new Error('Status inválido');
    }

    const query = `
      UPDATE pedidos 
      SET status = $1
      WHERE id_pedido = $2
      RETURNING *
    `;
    const result = await db.query(query, [status, pedidoId]);
    return result.rows[0];
  }
}

module.exports = Pedido;
