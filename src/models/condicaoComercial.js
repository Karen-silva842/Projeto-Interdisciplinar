const db = require('../db');

class CondicaoComercial {

  static async criar(condicaoData) {
    const {
      fornecedor_id,
      estado,
      percentual_cashback,
      prazo_pagamento_dias,
      ajuste_preco_unitario
    } = condicaoData;

    const query = `
      INSERT INTO condicoes_comerciais (
        fornecedor_id, estado, percentual_cashback, prazo_pagamento_dias,
        ajuste_preco_unitario, criado_em
      ) VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;

    const result = await db.query(query, [
      fornecedor_id,
      estado,
      percentual_cashback,
      prazo_pagamento_dias,
      ajuste_preco_unitario
    ]);

    return result.rows[0];
  }

  static async buscarPorFornecedor(fornecedorId) {
    const query = `
      SELECT * FROM condicoes_comerciais
      WHERE fornecedor_id = $1
      ORDER BY estado
    `;
    const result = await db.query(query, [fornecedorId]);
    return result.rows;
  }

  static async buscarPorFornecedorEEstado(fornecedorId, estado) {
    const query = `
      SELECT * FROM condicoes_comerciais
      WHERE fornecedor_id = $1 AND estado = $2
    `;
    const result = await db.query(query, [fornecedorId, estado]);
    return result.rows[0];
  }

  static async atualizar(id, condicaoData) {
    const camposPermitidos = [
      'percentual_cashback',
      'prazo_pagamento_dias',
      'ajuste_preco_unitario'
    ];

    const setClause = [];
    const valores = [];
    let contador = 1;

    camposPermitidos.forEach(campo => {
      if (condicaoData[campo] !== undefined) {
        setClause.push(`${campo} = $${contador}`);
        valores.push(condicaoData[campo]);
        contador++;
      }
    });

    if (setClause.length === 0) {
      throw new Error('Nenhum campo válido para atualização');
    }

    valores.push(id);

    const query = `
      UPDATE condicoes_comerciais
      SET ${setClause.join(', ')}, atualizado_em = NOW()
      WHERE id = $${contador}
      RETURNING *
    `;

    const result = await db.query(query, valores);
    return result.rows[0];
  }

  static async excluir(id) {
    const query = `
      DELETE FROM condicoes_comerciais
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = CondicaoComercial;
