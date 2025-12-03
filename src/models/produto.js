const db = require('../db');

class Produto {
  static async criar(produtoData) {
    const {
      nome,
      descricao,
      preco,
      sku,
      fornecedor_id,
      categoria_id,
      imagem_url
    } = produtoData;

    const query = `
      INSERT INTO produtos (
        nome, descricao, preco, sku, fornecedor_id, categoria_id, imagem_url, criado_em
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;

    const result = await db.query(query, [
      nome, descricao, preco, sku, fornecedor_id, categoria_id, imagem_url
    ]);

    return result.rows[0];
  }

  static async buscarPorFornecedor(fornecedorId) {
    const query = `
      SELECT p.*, c.nome AS categoria_nome
      FROM produtos p
      JOIN categorias c ON p.categoria_id = c.id_categoria
      WHERE p.fornecedor_id = $1
      ORDER BY p.nome
    `;
    const result = await db.query(query, [fornecedorId]);
    return result.rows;
  }

  static async buscarPorCategoria(categoriaId) {
    const query = `
      SELECT p.*, f.nome AS fornecedor_nome, c.nome AS categoria_nome
      FROM produtos p
      JOIN fornecedores f ON p.fornecedor_id = f.id
      JOIN categorias c ON p.categoria_id = c.id_categoria
      WHERE p.categoria_id = $1
      ORDER BY p.nome
    `;
    const result = await db.query(query, [categoriaId]);
    return result.rows;
  }

  static async buscarPorId(id) {
    const query = `
      SELECT p.*, f.nome AS fornecedor_nome, c.nome AS categoria_nome
      FROM produtos p
      JOIN fornecedores f ON p.fornecedor_id = f.id
      JOIN categorias c ON p.categoria_id = c.id_categoria
      WHERE p.id_produto = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async atualizar(id, produtoData) {
    const camposPermitidos = [
      'nome',
      'descricao',
      'preco',
      'imagem_url',
      'sku',
      'fornecedor_id',
      'categoria_id'
    ];

    const setClause = [];
    const valores = [];
    let contador = 1;

    camposPermitidos.forEach(campo => {
      if (produtoData[campo] !== undefined) {
        setClause.push(`${campo} = $${contador}`);
        valores.push(produtoData[campo]);
        contador++;
      }
    });

    if (setClause.length === 0) {
      throw new Error('Nenhum campo válido para atualização');
    }

    valores.push(id);

    const query = `
      UPDATE produtos
      SET ${setClause.join(', ')}, atualizado_em = NOW()
      WHERE id_produto = $${contador}
      RETURNING *
    `;

    const result = await db.query(query, valores);
    return result.rows[0];
  }

  static async excluir(id) {
    const query = 'DELETE FROM produtos WHERE id_produto = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Produto;
