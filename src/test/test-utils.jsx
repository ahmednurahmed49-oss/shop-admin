import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import AddProduct from "../pages/AddProduct";
import ProductDetail from "../pages/ProductDetails";
import EditProduct from "../pages/EditProduct";
import NotFound from "../pages/NotFound";
import Navbar from "../components/Navbar";
export const mockProducts = [
  {
    id: "1",
    name: "Nike Air Max 270",
    description: "Comfortable everyday sneakers.",
    price: 12000,
    category: "Shoes",
    stock: 25,
    sku: "NK-AM270-001",
    image: "https://example.com/nike.jpg",
    status: "Active",
    createdAt: "2026-01-04",
    updatedAt: "2026-02-01",
  },
  {
    id: "2",
    name: "Samsung Galaxy A55",
    description: "Mid-range smartphone with a great camera.",
    price: 46500,
    category: "Electronics",
    stock: 3,
    sku: "SM-A55-003",
    image: "https://example.com/samsung.jpg",
    status: "Active",
    createdAt: "2026-01-12",
    updatedAt: "2026-02-02",
  },
  {
    id: "3",
    name: "Ceramic Coffee Mug Set",
    description: "Set of four matte ceramic mugs.",
    price: 1900,
    category: "Home",
    stock: 0,
    sku: "HM-MUG-010",
    image: "https://example.com/mug.jpg",
    status: "Draft",
    createdAt: "2026-01-28",
    updatedAt: "2026-02-03",
  },
];

export function renderApp(initialPath = "/") {
  const result = render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<AddProduct />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/:id/edit" element={<EditProduct />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>
  );

  return result;
}

export function renderWithRouter(node, initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={node} />
      </Routes>
    </MemoryRouter>
  );
}

export function mockApi(initial = mockProducts) {
  let products = initial.map((product) => ({
    ...product,
  }));

  const calls = [];

  const fetchMock = vi.fn(async (input, init) => {
    const url = String(input);

    const method = (
      init?.method ?? "GET"
    ).toUpperCase();

    const body = init?.body
      ? JSON.parse(String(init.body))
      : undefined;

    calls.push({
      url,
      method,
      body,
    });

    const idMatch = url.match(/\/products\/(.+)$/);

    const respond = (data, status = 200) => ({
      ok: status >= 200 && status < 300,
      status,
      json: async () => data,
    });

    if (method === "GET" && !idMatch) {
      return respond(products);
    }

    if (method === "GET" && idMatch) {
      const found = products.find(
        (product) => product.id === idMatch[1]
      );

      return found
        ? respond(found)
        : respond({ message: "Not found" }, 404);
    }

    if (method === "POST") {
      const created = {
        ...body,
        id: "99",
        createdAt: "2026-03-01",
        updatedAt: "2026-03-01",
      };

      products = [created, ...products];

      return respond(created, 201);
    }

    if (method === "PATCH" && idMatch) {
      const found = products.find(
        (product) => product.id === idMatch[1]
      );

      if (!found) {
        return respond({ message: "Not found" }, 404);
      }

      const updated = {
        ...found,
        ...body,
        updatedAt: "2026-03-01",
      };

      products = products.map((product) =>
        product.id === updated.id ? updated : product
      );

      return respond(updated);
    }

    if (method === "DELETE" && idMatch) {
      products = products.filter(
        (product) => product.id !== idMatch[1]
      );

      return respond({});
    }

    return respond({ message: "Unhandled" }, 500);
  });

  vi.stubGlobal("fetch", fetchMock);

  return {
    fetchMock,
    calls,
    getProducts: () => products,
  };
}

export function mockApiFailure() {
  const fetchMock = vi.fn(async () => {
    throw new Error("Network down");
  });

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}