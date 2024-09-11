const productController = require("./productController");
const { getProducts, saveProducts } = require("../utils/fileUtils");

// Mock dependencies
jest.mock("../utils/fileUtils");

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
    it("should return all products", () => {
      const mockProducts = [
        { id: 1, title: "Product 1" },
        { id: 2, title: "Product 2" },
      ];
      getProducts.mockReturnValue(mockProducts);

      productController.getAllProducts(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
    });
  });

  describe("getProductById", () => {
    it("should return a product if it exists", () => {
      const mockProducts = [
        { id: 1, title: "Product 1" },
        { id: 2, title: "Product 2" },
      ];
      getProducts.mockReturnValue(mockProducts);

      mockRequest.params = { id: "1" };

      productController.getProductById(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts[0]);
    });

    it("should return 404 if product does not exist", () => {
      const mockProducts = [
        { id: 1, title: "Product 1" },
        { id: 2, title: "Product 2" },
      ];
      getProducts.mockReturnValue(mockProducts);

      mockRequest.params = { id: "3" };

      productController.getProductById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Produk tidak ditemukan",
      });
    });
  });

  describe("createProduct", () => {
    it("should create a new product", () => {
      const mockProducts = [];
      getProducts.mockReturnValue(mockProducts);

      mockRequest.body = { title: "New Product" };
      mockRequest.file = { filename: "image.jpg" };

      productController.createProduct(mockRequest, mockResponse);

      expect(saveProducts).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: "New Product",
          image: "image.jpg",
        })
      );
    });

    it("should return 400 if title or image is missing", () => {
      mockRequest.body = {};
      mockRequest.file = null;

      productController.createProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Judul dan gambar diperlukan",
      });
    });

    it("should return 400 if image is not uploaded", () => {
      mockRequest.body = { title: "New Product" };
      mockRequest.file = undefined; // Simulasi tidak ada file yang diunggah

      productController.createProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Judul dan gambar diperlukan",
      });
    });

    it("should return 400 if title is provided but image is not uploaded", () => {
      mockRequest.body = { title: "New Product" };
      mockRequest.file = null; // Alternatif cara simulasi tidak ada file

      productController.createProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Judul dan gambar diperlukan",
      });
    });
  });

  describe("updateProduct", () => {
    it("should update an existing product", () => {
      const mockProducts = [{ id: 1, title: "Old Product", image: "old.jpg" }];
      getProducts.mockReturnValue(mockProducts);

      mockRequest.params = { id: "1" };
      mockRequest.body = { title: "Updated Product" };
      mockRequest.file = { filename: "new.jpg" };

      productController.updateProduct(mockRequest, mockResponse);

      expect(saveProducts).toHaveBeenCalledWith([
        { id: 1, title: "Updated Product", image: "uploads/new.jpg" },
      ]);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: "Updated Product",
          image: "uploads/new.jpg",
        })
      );
    });

    it("should update product without changing image if no new image is provided", () => {
      const mockProducts = [{ id: 1, title: "Old Product", image: "old.jpg" }];
      getProducts.mockReturnValue(mockProducts);

      mockRequest.params = { id: "1" };
      mockRequest.body = { title: "Updated Product" };
      mockRequest.file = null;

      productController.updateProduct(mockRequest, mockResponse);

      expect(saveProducts).toHaveBeenCalledWith([
        { id: 1, title: "Updated Product", image: "old.jpg" },
      ]);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: "Updated Product",
          image: "old.jpg",
        })
      );
    });

    it("should return 404 if product to update does not exist", () => {
      getProducts.mockReturnValue([]);

      mockRequest.params = { id: "1" };
      mockRequest.body = { title: "Updated Product" };

      productController.updateProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Produk tidak ditemukan",
      });
    });
  });

  describe("deleteProduct", () => {
    it("should delete an existing product", () => {
      const mockProducts = [{ id: 1, title: "Product to Delete" }];
      getProducts.mockReturnValue(mockProducts);

      mockRequest.params = { id: "1" };

      productController.deleteProduct(mockRequest, mockResponse);

      expect(saveProducts).toHaveBeenCalledWith([]);
      expect(mockResponse.json).toHaveBeenCalledWith([
        { id: 1, title: "Product to Delete" },
      ]);
    });

    it("should return 404 if product to delete does not exist", () => {
      getProducts.mockReturnValue([]);

      mockRequest.params = { id: "1" };

      productController.deleteProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Produk tidak ditemukan",
      });
    });
  });
});
