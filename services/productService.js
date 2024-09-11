const { getProducts, saveProducts } = require("../utils/fileUtils");

class ProductService {
  async createProduct(title, image) {
    if (!title || !image) {
      throw new Error("Judul dan gambar diperlukan");
    }

    const products = await getProducts();
    const newProduct = {
      id: products.length + 1,
      title,
      image,
    };

    products.push(newProduct);
    await saveProducts(products);

    return newProduct;
  }

  async getAllProducts() {
    return await getProducts();
  }

  async getProductById(id) {
    const products = await getProducts();
    const product = products.find((p) => p.id === parseInt(id));
    if (!product) {
      throw new Error("Produk tidak ditemukan");
    }
    return product;
  }

  async updateProduct(id, title, image) {
    const products = await getProducts();
    const productIndex = products.findIndex((p) => p.id === parseInt(id));
    if (productIndex === -1) {
      throw new Error("Produk tidak ditemukan");
    }

    const updatedProduct = Object.assign({}, products[productIndex], {
      title: title || products[productIndex].title,
      image: image || products[productIndex].image,
    });

    products[productIndex] = updatedProduct;
    await saveProducts(products);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await getProducts();
    const productIndex = products.findIndex((p) => p.id === parseInt(id));
    if (productIndex === -1) {
      throw new Error("Produk tidak ditemukan");
    }

    const deletedProduct = products.splice(productIndex, 1);
    await saveProducts(products);
    return deletedProduct;
  }
}

module.exports = new ProductService();
