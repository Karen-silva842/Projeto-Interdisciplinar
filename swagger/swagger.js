
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Central de Compras API',
      version: '1.0.0',
      description: 'API para sistema de Central de Compras - Conectando lojistas e fornecedores',
      contact: {
        name: 'Suporte Central de Compras',
        email: 'suporte@centralcompras.com'
      }
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.centralcompras.com',
        description: 'Servidor de Produção'
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },

      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            tipo: {
              type: 'string',
              enum: ['administrador', 'loja', 'fornecedor']
            },
            nome: { type: 'string' }
          }
        },

        Loja: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            cnpj: { type: 'string' },
            estado: { type: 'string' }
          }
        },

        Fornecedor: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            cnpj: { type: 'string' }
          }
        },

        Produto: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            preco: { type: 'number' },
            categoria_id: { type: 'integer' }
          }
        },

        Pedido: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            status: {
              type: 'string',
              enum: ['pendente', 'separado', 'enviado', 'entregue', 'cancelado']
            },
            valor_total: { type: 'number' }
          }
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ],

    tags: [
      { name: 'Usuários', description: 'Endpoints relacionados a autenticação e usuários' },
      { name: 'Administradores', description: 'Endpoints exclusivos para administradores' },
      { name: 'Lojas', description: 'Endpoints para lojas' },
      { name: 'Fornecedores', description: 'Endpoints para fornecedores' },
      { name: 'Produtos', description: 'Endpoints relacionados a produtos' },
      { name: 'Pedidos', description: 'Endpoints relacionados a pedidos' },
      { name: 'Campanhas', description: 'Endpoints para campanhas promocionais' },
      { name: 'Condições Comerciais', description: 'Endpoints para condições comerciais por estado' }
    ]
  },

  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
