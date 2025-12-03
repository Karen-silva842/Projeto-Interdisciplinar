const express = require('express');
const router = express.Router();

const UsuariosController = require('../src/controllers/usuariosController');

const authMiddleware = require('../src/middlewares/authMiddleware');


/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Rotas para gerenciamento de usuários e autenticação
 */

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', UsuariosController.login);

/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     summary: Obter perfil do usuário logado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 tipo:
 *                   type: string
 */
router.get('/perfil', authMiddleware, UsuariosController.getPerfil);

/**
 * @swagger
 * /api/usuarios/alterar-senha:
 *   put:
 *     summary: Alterar senha do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senha_atual
 *               - nova_senha
 *             properties:
 *               senha_atual:
 *                 type: string
 *               nova_senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Senha atual incorreta
 *       401:
 *         description: Usuário não autenticado
 */
router.put('/alterar-senha', authMiddleware, UsuariosController.alterarSenha);

module.exports = router;
