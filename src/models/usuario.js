const db = require('../db');
const { generatePasswordHash } = require('../utils/gerarCredenciais');
const Validacoes = require('../utils/validacoes');

class Usuario {

  static async criar({ email, senha, tipo, nome }) {
    Validacoes.validarEmail(email);
    Validacoes.validarSenha(senha);
    Validacoes.validarNome(nome);
    Validacoes.validarTipo(tipo);

    const senhaHash = await generatePasswordHash(senha);

    const query = `
      INSERT INTO usuarios (email, senha_hash, tipo, nome, criado_em)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, email, tipo, nome, criado_em
    `;

    const result = await db.query(query, [email, senhaHash, tipo, nome]);
    return result.rows[0];
  }

  static async buscarPorEmail(email) {
    Validacoes.validarEmail(email);

    const result = await db.query(`
      SELECT id, email, senha_hash, tipo, nome, criado_em
      FROM usuarios
      WHERE email = $1
    `, [email]);
    return result.rows[0];
  }

  static async buscarPorId(id) {
    const result = await db.query(`
      SELECT id, email, tipo, nome, criado_em
      FROM usuarios
      WHERE id = $1
    `, [id]);
    return result.rows[0];
  }

  static async listarPorTipo(tipo) {
    Validacoes.validarTipo(tipo);

    const result = await db.query(`
      SELECT id, email, tipo, nome, criado_em
      FROM usuarios
      WHERE tipo = $1
      ORDER BY criado_em DESC
    `, [tipo]);
    return result.rows;
  }

  static async atualizarSenha(id, novaSenha) {
    Validacoes.validarSenha(novaSenha);

    const senhaHash = await generatePasswordHash(novaSenha);

    const result = await db.query(`
      UPDATE usuarios
      SET senha_hash = $1, atualizado_em = NOW()
      WHERE id = $2
      RETURNING id, email, tipo, nome, criado_em
    `, [senhaHash, id]);

    return result.rows[0];
  }
}

module.exports = Usuario;
