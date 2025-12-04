const db = require('../db');

class Fornecedor {

  static async criar(data) {
    const {
      usuario_id,
      nome_fornecedor,
      endereco,
      email_contato,
      telefone,
      categoria,
      estado
    } = data;

    const query = `
      INSERT INTO fornecedores (
        usuario_id, nome_fornecedor, endereco, email_contato,
        telefone, categoria, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await db.query(query, [
      usuario_id,
      nome_fornecedor,
      endereco,
      email_contato,
      telefone,
      categoria,
      estado
    ]);

    return result.rows[0];
  }

  static async listarTodos() {
    const query = `
      SELECT f.*, u.email
      FROM fornecedores f
      JOIN usuarios u ON f.usuario_id = u.id
      ORDER BY f.nome_fornecedor ASC
    `;
    return (await db.query(query)).rows;
  }

  static async buscarPorId(id) {
    const query = `
      SELECT f.*, u.email
      FROM fornecedores f
      JOIN usuarios u ON f.usuario_id = u.id
      WHERE f.id_fornecedor = $1
    `;
    return (await db.query(query, [id])).rows[0];
  }

  static async buscarPorUsuarioId(usuario_id) {
    const query = `
      SELECT f.*, u.email
      FROM fornecedores f
      JOIN usuarios u ON f.usuario_id = u.id
      WHERE f.usuario_id = $1
    `;
    return (await db.query(query, [usuario_id])).rows[0];
  }

  static async buscarPorCategoria(categoria) {
    const query = `
      SELECT f.*, u.email
      FROM fornecedores f
      JOIN usuarios u ON f.usuario_id = u.id
      WHERE f.categoria = $1
    `;
    return (await db.query(query, [categoria])).rows;
  }

}

module.exports = Fornecedor;
