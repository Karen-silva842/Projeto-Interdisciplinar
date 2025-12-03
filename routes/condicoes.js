const express = require('express');
const router = express.Router();

const CondicoesController = require('../src/controllers/condicoesController');

const authMiddleware = require('../src/middlewares/authMiddleware'); 

router.use(authMiddleware);

/**
 * @swagger
 * /api/condicoes:
 *   get:
 *     summary: Listar condições do fornecedor
 *     tags: [Condições Comerciais]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de condições comerciais
 */
router.get('/', CondicoesController.listar);

/**
 * @swagger
 * /api/condicoes:
 *   post:
 *     summary: Criar nova condição comercial
 *     tags: [Condições Comerciais]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *               percentual_cashback:
 *                 type: number
 *               prazo_pagamento_dias:
 *                 type: integer
 *               ajuste_preco_unitario:
 *                 type: number
 *     responses:
 *       201:
 *         description: Condição comercial criada com sucesso
 */
router.post('/', CondicoesController.criar);

/**
 * @swagger
 * /api/condicoes/{id}:
 *   put:
 *     summary: Atualizar condição comercial
 *     tags: [Condições Comerciais]
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
 *               percentual_cashback:
 *                 type: number
 *               prazo_pagamento_dias:
 *                 type: integer
 *               ajuste_preco_unitario:
 *                 type: number
 *     responses:
 *       200:
 *         description: Condição comercial atualizada com sucesso
 */
router.put('/:id', CondicoesController.atualizar);

/**
 * @swagger
 * /api/condicoes/{id}:
 *   delete:
 *     summary: Excluir condição comercial
 *     tags: [Condições Comerciais]
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
 *         description: Condição comercial excluída com sucesso
 */
router.delete('/:id', CondicoesController.excluir);

module.exports = router;
