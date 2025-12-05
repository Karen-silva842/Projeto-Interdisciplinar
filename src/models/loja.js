const db = require('../db');

class Loja {
  static async criar(lojaData) {
    const {
      usuario_id,
      nome,
      cnpj,
      endereco,
      estado,
      responsavel,
      email,
      telefone
    } = lojaData;

    const query = `
      INSERT INTO lojas (
        usuario_id, nome, cnpj, endereco, estado, responsavel, email, telefone, criado_em
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `;

    const result = await db.query(query, [
      usuario_id, nome, cnpj, endereco, estado, responsavel, email, telefone
    ]);

    return result.rows[0];
  }

  static async deletar(loja_id) {
    const query = `
      DELETE FROM lojas
      WHERE id = $1
    `;
    await db.query(query, [loja_id]);
  }

  static async listarTodas() {
    const query = `
      SELECT l.*, u.email 
      FROM lojas l 
      JOIN usuarios u ON l.usuario_id = u.id
      ORDER BY l.nome
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async buscarPorId(id) {
    const query = `
      SELECT l.*, u.email 
      FROM lojas l 
      JOIN usuarios u ON l.usuario_id = u.id 
      WHERE l.id_loja = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async buscarPorUsuarioId(usuario_id) {
    const query = `
      SELECT l.*, u.email 
      FROM lojas l 
      JOIN usuarios u ON l.usuario_id = u.id 
      WHERE l.usuario_id = $1
    `;
    const result = await db.query(query, [usuario_id]);
    return result.rows[0];
  }

  static async atualizar(id, lojaData) {
    const camposPermitidos = [
      'nome', 'razao_social', 'logradouro', 'numero', 'complemento',
      'bairro', 'cidade', 'estado', 'cep', 'responsavel_nome',
      'responsavel_email', 'responsavel_telefone'
    ];

    const setClause = [];
    const valores = [];
    let contadorParam = 1;

    camposPermitidos.forEach(campo => {
      if (lojaData[campo] !== undefined) {
        setClause.push(`${campo} = $${contadorParam}`);
        valores.push(lojaData[campo]);
        contadorParam++;
      }
    });

    if (setClause.length === 0) {
      throw new Error('Nenhum campo válido para atualização');
    }

    valores.push(id);

    const query = `
      UPDATE lojas 
      SET ${setClause.join(', ')}, atualizado_em = NOW()
      WHERE id_loja = $${contadorParam}
      RETURNING *
    `;

    const result = await db.query(query, valores);
    return result.rows[0];
  }
}

module.exports = Loja;
