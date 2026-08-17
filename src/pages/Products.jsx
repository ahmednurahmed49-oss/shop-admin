import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import ConfirmDialog from "../components/ConfirmDialog";
import FilterBar from "../components/FilterBar";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";

import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  PageHeader,
} from "../components/ui-kit";

import { useProducts } from "../hooks/useProducts";
import { getStockStatus } from "../lib/format";

function Products() {
  const {
    products,
    loading,
    error,
    saving,
    deleteProduct,
    refreshProducts,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stock, setStock] = useState("All");
  const [pendingDelete, setPendingDelete] = useState(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      const matchesStock =
        stock === "All" ||
        getStockStatus(product.stock) === stock;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock
      );
    });
  }, [products, search, category, stock]);

  const filtersActive =
    Boolean(search) ||
    category !== "All" ||
    stock !== "All";

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setStock("All");
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteProduct(String(pendingDelete.id));

      toast.success("Product deleted successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not delete the product."
      );
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your store products."
        action={
          <Link
            to="/products/new"
            className="btn-primary"
          >
            <Plus
              className="size-4"
              aria-hidden="true"
            />
            Add Product
          </Link>
        }
      />

      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <FilterBar
          category={category}
          stock={stock}
          onCategoryChange={setCategory}
          onStockChange={setStock}
        />
      </div>

      {loading && (
        <LoadingSpinner label="Loading products..." />
      )}

      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={refreshProducts}
        />
      )}

      {!loading &&
        !error &&
        filtered.length === 0 && (
          <EmptyState
            title={
              filtersActive
                ? "No products found."
                : "No products available."
            }
            description={
              filtersActive
                ? "No products match your search or filters."
                : "Add your first product to start managing your catalogue."
            }
            action={
              filtersActive ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  to="/products/new"
                  className="btn-primary"
                >
                  Add Product
                </Link>
              )
            }
          />
        )}

      {!loading &&
        !error &&
        filtered.length > 0 && (
          <>
            <p className="mb-3 text-sm text-muted-foreground">
              Showing {filtered.length} of{" "}
              {products.length} products
            </p>

            <ProductList
              products={filtered}
              onDelete={setPendingDelete}
            />
          </>
        )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${
          pendingDelete?.name ?? "product"
        }?`}
        description="Are you sure you want to delete this product? This action cannot be undone."
        busy={saving}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default Products;