const fs = require("fs");

module.exports.getProducts = () => {
  const products = JSON.parse(fs.readFileSync("products.json", "utf8"));
  return products;
};

module.exports.saveProducts = (products) => {
  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));
};
