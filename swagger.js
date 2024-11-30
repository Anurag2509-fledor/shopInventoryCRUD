const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Shop Inventory API',
    version: '1.0.0',
    description: 'API documentation for managing inventory and sales in a shop',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API docs in your project
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
