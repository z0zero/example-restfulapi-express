const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerConfig = require("./config/swaggerConfig");
const productRoutes = require("./src/routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use("/products", productRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server berjalan pada port ${PORT}`);
});
