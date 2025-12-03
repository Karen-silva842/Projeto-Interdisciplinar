const express = require('express');
const router = express.Router();

const LojasController = require('../src/controllers/lojasController');

const authMiddleware = require('../src/middlewares/authMiddleware'); 

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Lojas
 *   description: Rotas de gerenciamento de lojas
 */

/**
 * @swagger
 * /api/lojas/perfil:
 *   get:
 *     summary: Obter dados da loja logada
 *     tags: [Lojas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados da loja
 */
router.get('/perfil', LojasController.getPerfil);

/**
 * @swagger
 * /api/lojas/perfil:
 *   put:
 *     summary: Atualizar dados da loja
 *     tags: [Lojas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               responsavel_nome:
 *                 type: string
 *               responsavel_email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 */
router.put('/perfil', LojasController.atualizarPerfil);

/**
 * @swagger
 * /api/lojas/fornecedores:
 *   get:
 *     summary: Listar fornecedores
 *     tags: [Lojas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de fornecedores
 */
router.get('/fornecedores', LojasController.listarFornecedores);

/**
 * @swagger
 * /api/lojas/produtos:
 *   get:
 *     summary: Listar produtos
 *     tags: [Lojas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get('/produtos', LojasController.listarProdutos);

/**
 * @swagger
 * /api/lojas/pedidos:
 *   post:
 *     summary: Criar novo pedido
 *     tags: [Lojas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fornecedor_id
 *               - itens
 *             properties:
 *               fornecedor_id:
 *                 type: integer
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 */
router.post('/pedidos', LojasController.criarPedido);

/**
 * @swagger
 * /api/lojas/pedidos:
 *   get:
 *     summary: Listar pedidos da loja
 *     tags: [Lojas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/pedidos', LojasController.listarPedidos);

/**
 * @swagger
 * /api/lojas/pedidos/{id}:
 *   get:
 *     summary: Buscar pedido específico
 *     tags: [Lojas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do pedido
 */
router.get('/pedidos/:id', LojasController.buscarPedido);

module.exports = router;
