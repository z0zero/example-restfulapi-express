const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Manajemen Produk",
      version: "1.0.0",
      description: "Dokumentasi API untuk manajemen produk",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Server Pengembangan",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path ke file rute
};

const specs = swaggerJsdoc(options);

module.exports = specs;
