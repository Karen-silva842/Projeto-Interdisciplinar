const db = require('../db');

class Produto {
  static async criar(produtoData) {
    const {
      nome,
      descricao,
      preco,
      quantidade_estoque,
      fornecedor_id,
      status
    } = produtoData;

    const query = `
      INSERT INTO produtos (
        nome, descricao, preco, quantidade_estoque, fornecedor_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await db.query(query, [
      nome, descricao, preco, quantidade_estoque, fornecedor_id, status
    ]);

    return result.rows[0];
  }

  static async deletar(id) {
    const query = `
      DELETE FROM produtos WHERE id_produto = $1
    `;
    await db.query(query, [id]);
  }

  static async buscarPorFornecedor(fornecedorId) {
    const query = `
      SELECT p.*, f.nome_fornecedor
      FROM produtos p
      JOIN fornecedores f ON p.fornecedor_id = f.id_fornecedor
      WHERE p.fornecedor_id = $1
      ORDER BY p.nome
    `;
    const result = await db.query(query, [fornecedorId]);
    return result.rows;
  }

  static async buscarTodos({ pagina = 1, limite = 10 }) {
    const query = `
      SELECT p.*, f.nome_fornecedor
      FROM produtos p
      JOIN fornecedores f ON p.fornecedor_id = f.id_fornecedor
      ORDER BY p.nome
      LIMIT $1 OFFSET $2
    `;
    const result = await db.query(query, [limite, (pagina - 1) * limite]);
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
      'quantidade_estoque',
      'status',
      'fornecedor_id',
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
      SET ${setClause.join(', ')}
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
