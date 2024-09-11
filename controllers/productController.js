const { getProducts, saveProducts } = require("../utils/fileUtils");

exports.createProduct = (req, res) => {
  const { title } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !image) {
    return res.status(400).json({ message: "Judul dan gambar diperlukan" });
  }

  const products = getProducts();
  const newProduct = {
    id: products.length + 1,
    title,
    image,
  };

  products.push(newProduct);
  saveProducts(products);

  res.status(201).json(newProduct);
};

exports.getAllProducts = (req, res) => {
  const products = getProducts();
  res.json(products);
};

exports.getProductById = (req, res) => {
  const { id } = req.params;
  const products = getProducts();
  const product = products.find((p) => p.id === parseInt(id));
  if (!product) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }
  res.json(product);
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const products = getProducts();
  const productIndex = products.findIndex((p) => p.id === parseInt(id));
  if (productIndex === -1) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }
  const image = req.file
    ? `uploads/${req.file.filename}`
    : products[productIndex].image;

  const updatedProduct = {
    ...products[productIndex],
    title,
    image,
  };

  products[productIndex] = updatedProduct;
  saveProducts(products);
  res.json(updatedProduct);
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const products = getProducts();
  const productIndex = products.findIndex((p) => p.id === parseInt(id));
  if (productIndex === -1) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }
  const deletedProduct = products.splice(productIndex, 1);
  saveProducts(products);
  res.json(deletedProduct);
};
