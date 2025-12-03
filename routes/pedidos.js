const express = require('express');
const router = express.Router();

const PedidosController = require('../src/controllers/pedidosController');

const authMiddleware = require('../src/middlewares/authMiddleware');

/**
 * @swagger
 * /api/pedidos/calcular-condicoes:
 *   post:
 *     summary: Calcular co ndições comerciais para um pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fornecedor_id
 *               - estado_loja
 *               - itens
 *             properties:
 *               fornecedor_id:
 *                 type: integer
 *               estado_loja:
 *                 type: string
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Cálculo das condições
 */
router.post('/calcular-condicoes', PedidosController.calcularCondicoes);

router.use(authMiddleware);

/**
 * @swagger
 * /api/pedidos/{id}/itens:
 *   get:
 *     summary: Buscar itens de um pedido
 *     tags: [Pedidos]
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
 *         description: Itens do pedido
 */
router.get('/:id/itens', PedidosController.buscarItensPedido);

/**
 * @swagger
 * /api/pedidos/{id}/detalhes:
 *   get:
 *     summary: Detalhes completos do pedido
 *     tags: [Pedidos]
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
 *         description: Detalhes completos do pedido
 */
router.get('/:id/detalhes', PedidosController.detalhesPedido);

module.exports = router;
