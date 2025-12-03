const Usuario = require('../models/usuario');
const Loja = require('../models/loja');
const Fornecedor = require('../models/fornecedor');
const { verifyPassword, generateToken } = require('../utils/gerarCredenciais');

class UsuariosController {
  static async login(req, res) {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });

      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) return res.status(401).json({ success: false, message: 'Credenciais inválidas' });

      const senhaValida = await verifyPassword(senha, usuario.senha_hash);
      if (!senhaValida) return res.status(401).json({ success: false, message: 'Credenciais inválidas' });

      let perfil = null;
      if (usuario.tipo === 'loja') perfil = await Loja.buscarPorUsuarioId(usuario.id);
      else if (usuario.tipo === 'fornecedor') perfil = await Fornecedor.buscarPorUsuarioId(usuario.id);

      const token = generateToken({
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo,
        perfil_id: perfil ? perfil.id : null
      });

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: { token, usuario: { id: usuario.id, email: usuario.email, tipo: usuario.tipo, nome: usuario.nome }, perfil }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao realizar login', error: error.message });
    }
  }

  static async getPerfil(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const tipoUsuario = req.usuario.tipo;

      const usuario = await Usuario.buscarPorId(usuarioId);
      let perfil = null;

      if (tipoUsuario === 'loja') perfil = await Loja.buscarPorUsuarioId(usuarioId);
      else if (tipoUsuario === 'fornecedor') perfil = await Fornecedor.buscarPorUsuarioId(usuarioId);

      res.json({ success: true, data: { usuario, perfil } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao buscar perfil', error: error.message });
    }
  }

  static async alterarSenha(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const { senha_atual, nova_senha } = req.body;

      if (!senha_atual || !nova_senha) return res.status(400).json({ success: false, message: 'Senha atual e nova senha são obrigatórias' });

      const usuario = await Usuario.buscarPorId(usuarioId);
      if (!usuario) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });

      const senhaValida = await verifyPassword(senha_atual, usuario.senha_hash);
      if (!senhaValida) return res.status(401).json({ success: false, message: 'Senha atual incorreta' });

      await Usuario.atualizarSenha(usuarioId, nova_senha);

      res.json({ success: true, message: 'Senha alterada com sucesso' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao alterar senha', error: error.message });
    }
  }
}

module.exports = UsuariosController;
