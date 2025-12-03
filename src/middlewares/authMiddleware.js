const jwtUtils = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) return res.status(401).json({ error: 'Token inválido' });

    const decoded = jwtUtils.verificarToken(token);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware; 
