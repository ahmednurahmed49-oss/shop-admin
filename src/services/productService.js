/**
 * Centralised API base URL.
 *
 * Local development:
 * VITE_API_URL=http://localhost:3000
 *
 * If no VITE_API_URL is provided, it uses /api/public.
 */
export const API_BASE_URL = "http://localhost:3000";
  import.meta.env?.VITE_API_URL || "/api/public";

const PRODUCTS_URL = `${API_BASE_URL}/products`;

async function request(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
  } catch {
    throw new Error(
      "Unable to reach the server. Please check your connection and try again."
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Product not found.");
    }

    throw new Error(`Request failed with status ${response.status}.`);
  }

  if (response.status === 204) {
    return undefined;
  }

  return await response.json();
}

export const getProducts = () => request(PRODUCTS_URL);

export const getProduct = (id) =>
  request(`${PRODUCTS_URL}/${id}`);

export const createProduct = (product) =>
  request(PRODUCTS_URL, {
    method: "POST",
    body: JSON.stringify(product),
  });

export const updateProduct = (id, changes) =>
  request(`${PRODUCTS_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });

export const deleteProduct = (id) =>
  request(`${PRODUCTS_URL}/${id}`, {
    method: "DELETE",
  });