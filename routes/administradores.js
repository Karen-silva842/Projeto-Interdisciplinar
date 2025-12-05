const express = require('express');
const router = express.Router();

const AdministradoresController = require('../src/controllers/administradoresController');
const authMiddleware = require('../src/middlewares/authMiddleware'); 

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Administradores
 *   description: Rotas para gerenciamento de lojas e fornecedores
 */

/**
 * @swagger
 * /api/administradores/lojas:
 *   post:
 *     summary: Cadastrar uma nova loja
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dados da loja
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               endereco:
 *                 type: string
 *               telefone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Loja cadastrada com sucesso
 *       500:
 *         description: Erro ao cadastrar loja
 */
router.post('/lojas', AdministradoresController.cadastrarLoja);

/**
 * @swagger
 * /api/administradores/lojas/:id:
 *   delete:
 *     summary: Deletar uma loja
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da loja a ser deletada
 *     responses:
 *       201:
 *         description: Loja deletada com sucesso
 *       500:
 *         description: Erro ao deletar loja
 */
router.delete('/lojas/:id', AdministradoresController.deletarLoja);

/**
 * @swagger
 * /api/administradores/fornecedores/:id:
 *   delete:
 *     summary: Deletar um fornecedor
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fornecedor a ser deletado
 *     responses:
 *       201:
 *         description: Fornecedor deletado com sucesso
 *       500:
 *         description: Erro ao deletar fornecedor
 */
router.delete('/fornecedores/:id', AdministradoresController.deletarFornecedor);

/**
 * @swagger
 * /api/administradores/produtos/:id:
 *   delete:
 *     summary: Deletar um produto
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser deletado
 *     responses:
 *       201:
 *         description: Produto deletado com sucesso
 *       500:
 *         description: Erro ao deletar produto
 */
router.delete('/produtos/:id', AdministradoresController.deletarProduto);

/**
 * @swagger
 * /api/administradores/produtos:
 *   post:
 *     summary: Cadastrar um novo produto
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dados do produto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               status:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               quantidade_estoque:
 *                 type: number
 *               fornecedor_id:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso
 *       500:
 *         description: Erro ao cadastrar produto
 */
router.post('/produtos', AdministradoresController.cadastrarProduto);

/**
 * @swagger
 * /api/administradores/lojas:
 *   get:
 *     summary: Listar todas as lojas
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de lojas
 *       500:
 *         description: Erro ao listar lojas
 */
router.get('/lojas', AdministradoresController.listarLojas);

/**
 * @swagger
 * /api/administradores/fornecedores:
 *   post:
 *     summary: Cadastrar um novo fornecedor
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dados do fornecedor
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               empresa:
 *                 type: string
 *               telefone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fornecedor cadastrado com sucesso
 *       500:
 *         description: Erro ao cadastrar fornecedor
 */
router.post('/fornecedores', AdministradoresController.cadastrarFornecedor);

/**
 * @swagger
 * /api/administradores/fornecedores:
 *   get:
 *     summary: Listar todos os fornecedores
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de fornecedores
 *       500:
 *         description: Erro ao listar fornecedores
 */
router.get('/fornecedores', AdministradoresController.listarFornecedores);

/**
 * @swagger
 * /api/administradores/credenciais/{usuario_id}:
 *   post:
 *     summary: Gerar novas credenciais para um usuário
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Credenciais geradas com sucesso
 *       500:
 *         description: Erro ao gerar credenciais
 */
router.post('/credenciais/:usuario_id', AdministradoresController.gerarCredenciais);

module.exports = router;
