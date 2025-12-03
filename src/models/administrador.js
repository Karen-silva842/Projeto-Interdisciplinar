const db = require('../db');
const { generatePasswordHash } = require('../utils/gerarCredenciais');
const Validacoes = require('../utils/validacoes');

class Usuario {

  static async criar({ email, senha, tipo, nome }) {
    // =============== VALIDAÇÕES ===============
    Validacoes.validarEmail(email);
    Validacoes.validarSenha(senha);
    Validacoes.validarNome(nome);
    Validacoes.validarTipo(tipo);
    // ==========================================

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
    const result = await db.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async buscarPorId(id) {
    const result = await db.query(
      'SELECT id, email, tipo, nome, criado_em FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async listarPorTipo(tipo) {
    const result = await db.query(
      'SELECT id, email, tipo, nome, criado_em FROM usuarios WHERE tipo = $1',
      [tipo]
    );
    return result.rows;
  }

  static async atualizarSenha(id, novaSenha) {
    // Validação reaproveitada
    Validacoes.validarSenha(novaSenha);

    const senhaHash = await generatePasswordHash(novaSenha);

    await db.query(
      'UPDATE usuarios SET senha_hash = $1 WHERE id = $2',
      [senhaHash, id]
    );
  }
}

module.exports = Usuario;
