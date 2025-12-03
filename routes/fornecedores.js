const express = require('express');
const router = express.Router();

const FornecedoresController = require('../src/controllers/fornecedoresController');

const authMiddleware = require('../src/middlewares/authMiddleware'); 

router.use(authMiddleware);

/**
 * @swagger
 * /api/fornecedores/perfil:
 *   get:
 *     summary: Obter dados do fornecedor logado
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do fornecedor
 */
router.get('/perfil', FornecedoresController.getPerfil);

/**
 * @swagger
 * /api/fornecedores/pedidos:
 *   get:
 *     summary: Listar pedidos recebidos
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/pedidos', FornecedoresController.listarPedidos);

/**
 * @swagger
 * /api/fornecedores/pedidos/{id}/status:
 *   put:
 *     summary: Atualizar status do pedido
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendente, separado, enviado, entregue, cancelado]
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 */
router.put('/pedidos/:id/status', FornecedoresController.atualizarStatusPedido);

/**
 * @swagger
 * /api/fornecedores/produtos:
 *   get:
 *     summary: Listar produtos do fornecedor
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get('/produtos', FornecedoresController.listarProdutos);

/**
 * @swagger
 * /api/fornecedores/produtos:
 *   post:
 *     summary: Cadastrar novo produto
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso
 */
router.post('/produtos', FornecedoresController.cadastrarProduto);

/**
 * @swagger
 * /api/fornecedores/produtos/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 */
router.put('/produtos/:id', FornecedoresController.atualizarProduto);

/**
 * @swagger
 * /api/fornecedores/produtos/{id}:
 *   delete:
 *     summary: Excluir produto
 *     tags: [Fornecedores]
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
 *         description: Produto excluído com sucesso
 */
router.delete('/produtos/:id', FornecedoresController.excluirProduto);

module.exports = router;
