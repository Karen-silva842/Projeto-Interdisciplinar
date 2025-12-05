const express = require('express');
const router = express.Router();

const ProdutosController = require('../src/controllers/produtosController');
const authMiddleware = require('../src/middlewares/authMiddleware');

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Listar todos os produtos (público)
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fornecedor_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get('/', ProdutosController.listarTodos);

/**
 * @swagger
 * /api/produtos/busca:
 *   get:
 *     summary: Buscar produtos por termo (público)
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultados da busca
 */
router.get('/busca', ProdutosController.buscar);

/**
 * @swagger
 * /api/produtos/fornecedor:
 *   get:
 *     summary: Listar todos os produtos do fornecedor logado
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtosdo fornecedor logado
 */
router.get('/fornecedor', authMiddleware, ProdutosController.buscarPorFornecedor);

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Buscar produto por ID (público)
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do produto
 */
router.get('/:id', ProdutosController.buscarPorId);

router.put('/:id', ProdutosController.atualizarProduto);

module.exports = router;
