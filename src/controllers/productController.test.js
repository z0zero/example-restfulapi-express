const productController = require("./productController");
const productService = require("../services/productService");

jest.mock("../services/productService");

describe("Product Controller", () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe("getAllProducts", () => {
    it("should return all products", async () => {
      const mockProducts = [{ id: 1, title: "Product 1" }];
      productService.getAllProducts.mockResolvedValue(mockProducts);

      await productController.getAllProducts(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should return 500 if there's an error", async () => {
      productService.getAllProducts.mockRejectedValue(
        new Error("Database error")
      );

      await productController.getAllProducts(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Gagal mengambil produk",
      });
    });
  });

  describe("getProductById", () => {
    it("should return 404 if product does not exist", async () => {
      mockRequest.params = { id: "999" };
      productService.getProductById.mockRejectedValue(
        new Error("Produk tidak ditemukan")
      );

      await productController.getProductById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Produk tidak ditemukan",
      });
    });
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      mockRequest.body = { title: "New Product" };
      mockRequest.file = { filename: "image.jpg" };
      const newProduct = { id: 1, title: "New Product", image: "image.jpg" };
      productService.createProduct.mockResolvedValue(newProduct);

      await productController.createProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(newProduct);
    });

    it("should return 400 if title or image is missing", async () => {
      mockRequest.body = {};
      mockRequest.file = null;
      productService.createProduct.mockRejectedValue(
        new Error("Judul dan gambar diperlukan")
      );

      await productController.createProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Judul dan gambar diperlukan",
      });
    });

    it("should return 400 if image is not uploaded", async () => {
      mockRequest.body = { title: "New Product" };
      mockRequest.file = null;
      productService.createProduct.mockRejectedValue(
        new Error("Judul dan gambar diperlukan")
      );

      await productController.createProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Judul dan gambar diperlukan",
      });
    });
  });

  describe("updateProduct", () => {
    it("should update an existing product", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { title: "Updated Product" };
      mockRequest.file = { filename: "new-image.jpg" };
      const updatedProduct = {
        id: 1,
        title: "Updated Product",
        image: "new-image.jpg",
      };
      productService.updateProduct.mockResolvedValue(updatedProduct);

      await productController.updateProduct(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(updatedProduct);
    });

    it("should update product without changing image if no new image is provided", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { title: "Updated Product" };
      mockRequest.file = null;
      const updatedProduct = {
        id: 1,
        title: "Updated Product",
        image: "old-image.jpg",
      };
      productService.updateProduct.mockResolvedValue(updatedProduct);

      await productController.updateProduct(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(updatedProduct);
    });

    it("should return 404 if product to update does not exist", async () => {
      mockRequest.params = { id: "999" };
      mockRequest.body = { title: "Updated Product" };
      productService.updateProduct.mockRejectedValue(
        new Error("Produk tidak ditemukan")
      );

      await productController.updateProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Produk tidak ditemukan",
      });
    });
  });

  describe("deleteProduct", () => {
    it("should delete an existing product", async () => {
      mockRequest.params = { id: "1" };
      const deletedProduct = { id: 1, title: "Deleted Product" };
      productService.deleteProduct.mockResolvedValue(deletedProduct);

      await productController.deleteProduct(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(deletedProduct);
    });

    it("should return 404 if product to delete does not exist", async () => {
      mockRequest.params = { id: "999" };
      productService.deleteProduct.mockRejectedValue(
        new Error("Produk tidak ditemukan")
      );

      await productController.deleteProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Produk tidak ditemukan",
      });
    });
  });
});
