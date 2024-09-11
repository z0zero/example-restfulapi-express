const productService = require("../services/productService");

module.exports.createProduct = async (req, res) => {
  try {
    const { title } = req.body;
    const image = req.file ? req.file.filename : null;
    const newProduct = await productService.createProduct(title, image);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil produk" });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const image = req.file ? req.file.filename : null;
    const updatedProduct = await productService.updateProduct(id, title, image);
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productService.deleteProduct(id);
    res.json(deletedProduct);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
