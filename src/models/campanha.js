const db = require('../db');

class Campanha {

  static async criar(campanhaData) {
    const {
      fornecedor_id,
      nome,
      descricao,
      tipo,
      valor_minimo,
      quantidade_minima,
      produto_id,
      tipo_recompensa,
      valor_recompensa,
      data_inicio,
      data_fim,
      ativa
    } = campanhaData;

    const query = `
      INSERT INTO campanhas (
        fornecedor_id, nome, descricao, tipo, valor_minimo, quantidade_minima,
        produto_id, tipo_recompensa, valor_recompensa, data_inicio, data_fim, ativa, criado_em
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      RETURNING *
    `;

    const result = await db.query(query, [
      fornecedor_id, nome, descricao, tipo, valor_minimo, quantidade_minima,
      produto_id, tipo_recompensa, valor_recompensa, data_inicio, data_fim, ativa
    ]);

    return result.rows[0];
  }

  static async buscarPorFornecedor(fornecedorId) {
    const query = `
      SELECT c.*, p.nome AS produto_nome
      FROM campanhas c
      LEFT JOIN produtos p ON c.produto_id = p.id
      WHERE c.fornecedor_id = $1
      ORDER BY c.criado_em DESC
    `;
    const result = await db.query(query, [fornecedorId]);
    return result.rows;
  }

  static async buscarCampanhasAtivas() {
    const query = `
      SELECT c.*, f.nome AS fornecedor_nome, p.nome AS produto_nome
      FROM campanhas c
      JOIN fornecedores f ON c.fornecedor_id = f.id
      LEFT JOIN produtos p ON c.produto_id = p.id
      WHERE c.ativa = true 
        AND c.data_inicio <= NOW() 
        AND c.data_fim >= NOW()
      ORDER BY c.criado_em DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async atualizar(id, campanhaData) {
    const camposPermitidos = [
      'nome', 'descricao', 'valor_minimo', 'quantidade_minima',
      'tipo_recompensa', 'valor_recompensa', 'data_inicio', 'data_fim', 'ativa'
    ];

    const setClause = [];
    const valores = [];
    let count = 1;

    camposPermitidos.forEach(campo => {
      if (campanhaData[campo] !== undefined) {
        setClause.push(`${campo} = $${count}`);
        valores.push(campanhaData[campo]);
        count++;
      }
    });

    if (setClause.length === 0) {
      throw new Error("Nenhum campo válido para atualização.");
    }

    valores.push(id);

    const query = `
      UPDATE campanhas
      SET ${setClause.join(', ')}, atualizado_em = NOW()
      WHERE id = $${count}
      RETURNING *
    `;

    const result = await db.query(query, valores);
    return result.rows[0];
  }

  static async excluir(id) {
    const query = 'DELETE FROM campanhas WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Campanha;
