const db = require('../db');

class Pedido {
  static async criar(pedidoData) {
    const {
      loja_id,
      fornecedor_id,
      itens,
      valor_total,
      condicao_comercial_id
    } = pedidoData;

    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const pedidoQuery = `
        INSERT INTO pedidos (
          loja_id, fornecedor_id, valor_total, condicao_comercial_id, status, criado_em
        ) VALUES ($1, $2, $3, $4, 'pendente', NOW())
        RETURNING *
      `;

      const pedidoResult = await client.query(pedidoQuery, [
        loja_id, fornecedor_id, valor_total, condicao_comercial_id
      ]);

      const pedido = pedidoResult.rows[0];

      for (const item of itens) {
        const itemQuery = `
          INSERT INTO itens_pedido (
            pedido_id, produto_id, quantidade, preco_unitario, valor_total
          ) VALUES ($1, $2, $3, $4, $5)
        `;

        await client.query(itemQuery, [
          pedido.id_pedido,      // CORRIGIDO
          item.produto_id,
          item.quantidade,
          item.preco_unitario,
          item.valor_total
        ]);
      }

      await client.query('COMMIT');
      return pedido;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;

    } finally {
      client.release();
    }
  }

  static async buscarPorLoja(lojaId) {
    const query = `
      SELECT 
        p.*, 
        f.nome AS fornecedor_nome,
        COUNT(ip.id) AS quantidade_itens
      FROM pedidos p
      JOIN fornecedores f ON p.fornecedor_id = f.id
      LEFT JOIN itens_pedido ip ON p.id_pedido = ip.pedido_id
      WHERE p.loja_id = $1
      GROUP BY p.id_pedido, f.nome
      ORDER BY p.criado_em DESC
    `;
    const result = await db.query(query, [lojaId]);
    return result.rows;
  }

  static async buscarPorFornecedor(fornecedorId) {
    const query = `
      SELECT 
        p.*, 
        l.nome AS loja_nome,
        COUNT(ip.id) AS quantidade_itens
      FROM pedidos p
      JOIN lojas l ON p.loja_id = l.id_loja
      LEFT JOIN itens_pedido ip ON p.id_pedido = ip.pedido_id
      WHERE p.fornecedor_id = $1
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
      'cancelado'
    ];

    if (!statusPermitidos.includes(status)) {
      throw new Error('Status inválido');
    }

    const query = `
      UPDATE pedidos 
      SET status = $1, atualizado_em = NOW()
      WHERE id_pedido = $2
      RETURNING *
    `;
    const result = await db.query(query, [status, pedidoId]);
    return result.rows[0];
  }
}

module.exports = Pedido;
