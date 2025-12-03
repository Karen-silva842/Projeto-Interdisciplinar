const express = require('express');
const router = express.Router();

const CampanhasController = require('../src/controllers/campanhasController');

const authMiddleware = require('../src/middlewares/authMiddleware');

/**
 * @swagger
 * /api/campanhas/ativas:
 *   get:
 *     summary: Listar campanhas ativas (público)
 *     tags: [Campanhas]
 *     responses:
 *       200:
 *         description: Lista de campanhas ativas
 */
router.get('/ativas', CampanhasController.listarAtivas);

router.use(authMiddleware);

/**
 * @swagger
 * /api/campanhas:
 *   get:
 *     summary: Listar campanhas do fornecedor
 *     tags: [Campanhas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de campanhas do fornecedor
 */
router.get('/', CampanhasController.listarFornecedor);

/**
 * @swagger
 * /api/campanhas:
 *   post:
 *     summary: Criar nova campanha
 *     tags: [Campanhas]
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
 *               - tipo
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [valor, quantidade]
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso
 */
router.post('/', CampanhasController.criar);

/**
 * @swagger
 * /api/campanhas/{id}:
 *   put:
 *     summary: Atualizar campanha
 *     tags: [Campanhas]
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
 *               ativa:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Campanha atualizada com sucesso
 */
router.put('/:id', CampanhasController.atualizar);

/**
 * @swagger
 * /api/campanhas/{id}:
 *   delete:
 *     summary: Excluir campanha
 *     tags: [Campanhas]
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
 *         description: Campanha excluída com sucesso
 */
router.delete('/:id', CampanhasController.excluir);

module.exports = router;
