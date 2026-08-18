// src/services/productService.js

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const headers = {
  "Content-Type": "application/json",
  "X-Master-Key": API_KEY,
};

// Get all products
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/latest`, {
      method: "GET",
      headers,
    });

    const result = await response.json();

    console.log("JSONBin response:", result);

    if (!response.ok) {
      throw new Error(
        result.message || `Failed to fetch products: ${response.status}`
      );
    }

    return result.record?.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get one product by ID
export const getProduct = async (id) => {
  try {
    const products = await getProducts();

    const product = products.find(
      (item) => String(item.id) === String(id)
    );

    if (!product) {
      throw new Error(`Product with ID ${id} was not found`);
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Add a new product
export const addProduct = async (product) => {
  try {
    const products = await getProducts();

    const newProduct = {
      ...product,
      id: Date.now(),
    };

    const updatedProducts = [...products, newProduct];

    const response = await fetch(API_URL, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        products: updatedProducts,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `Failed to add product: ${response.status}`
      );
    }

    return result.record?.products || updatedProducts;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (id, updatedProduct) => {
  try {
    const products = await getProducts();

    const productExists = products.some(
      (product) => String(product.id) === String(id)
    );

    if (!productExists) {
      throw new Error(`Product with ID ${id} was not found`);
    }

    const updatedProducts = products.map((product) =>
      String(product.id) === String(id)
        ? {
            ...product,
            ...updatedProduct,
            id: product.id,
          }
        : product
    );

    const response = await fetch(API_URL, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        products: updatedProducts,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `Failed to update product: ${response.status}`
      );
    }

    return result.record?.products || updatedProducts;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const products = await getProducts();

    const productExists = products.some(
      (product) => String(product.id) === String(id)
    );

    if (!productExists) {
      throw new Error(`Product with ID ${id} was not found`);
    }

    const updatedProducts = products.filter(
      (product) => String(product.id) !== String(id)
    );

    const response = await fetch(API_URL, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        products: updatedProducts,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `Failed to delete product: ${response.status}`
      );
    }

    return result.record?.products || updatedProducts;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};