const express = require("express");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Baca data dari file products.json
const getProducts = () => {
  const products = JSON.parse(fs.readFileSync("products.json", "utf8"));
  return products;
};

const saveProducts = (products) => {
  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));
};

// CREATE
app.post("/products", upload.single("image"), (req, res) => {
  const { title } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !image) {
    return res.status(400).json({ message: "Title and image are required" });
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
});

// READ All
app.get("/products", (req, res) => {
  const products = getProducts();
  res.json(products);
});

// READ By ID
app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const products = getProducts();
  const product = products.find((p) => p.id === parseInt(id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// UPDATE by ID
app.put("/products/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const products = getProducts();
  const productIndex = products.findIndex((p) => p.id === parseInt(id));
  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
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
});

// DELETE by ID
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const products = getProducts();
  const productIndex = products.findIndex((p) => p.id === parseInt(id));
  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }
  const deletedProduct = products.splice(productIndex, 1);
  saveProducts(products);
  res.json(deletedProduct);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
