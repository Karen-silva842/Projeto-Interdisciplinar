
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || "KahSuTokenUltraSeguro_2025!";

module.exports = {
  gerarToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '1d' });
  },

  verificarToken(token) {
    return jwt.verify(token, secretKey);
  }
};
