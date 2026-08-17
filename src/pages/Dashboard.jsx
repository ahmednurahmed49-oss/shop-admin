import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Boxes,
  PackageX,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import ConfirmDialog from "../components/ConfirmDialog";
import ProductList from "../components/ProductList";
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  PageHeader,
  StatCard,
} from "../components/ui-kit";

import { useProducts } from "../hooks/useProducts";

function Dashboard() {
  const {
    products,
    loading,
    error,
    saving,
    deleteProduct,
    refreshProducts,
  } = useProducts();

  const [pendingDelete, setPendingDelete] = useState(null);

  const stats = useMemo(
    () => ({
      total: products.length,

      inStock: products.filter((p) => p.stock > 5).length,

      lowStock: products.filter(
        (p) => p.stock > 0 && p.stock <= 5
      ).length,

      outOfStock: products.filter((p) => p.stock <= 0).length,
    }),
    [products]
  );

  const recent = useMemo(
    () =>
      [...products]
        .sort((a, b) =>
          a.createdAt < b.createdAt ? 1 : -1
        )
        .slice(0, 3),
    [products]
  );

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
        title="Welcome back, Administrator"
        description="Manage your store's products, stock levels and pricing from one place."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/products/new" className="btn-primary">
              <Plus className="size-4" aria-hidden="true" />
              Add Product
            </Link>

            <Link to="/products" className="btn-secondary">
              View Products
            </Link>
          </div>
        }
      />

      {loading && (
        <LoadingSpinner label="Loading products..." />
      )}

      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={refreshProducts}
        />
      )}

      {!loading && !error && (
        <>
          <section
            aria-label="Store statistics"
            role="region"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              label="Total Products"
              value={stats.total}
              icon={Boxes}
            />

            <StatCard
              label="In Stock"
              value={stats.inStock}
              icon={ShoppingCart}
              tone="success"
            />

            <StatCard
              label="Low Stock"
              value={stats.lowStock}
              icon={AlertTriangle}
              tone="warning"
            />

            <StatCard
              label="Out of Stock"
              value={stats.outOfStock}
              icon={PackageX}
              tone="destructive"
            />
          </section>

          <section
            aria-label="Recent products"
            className="mt-10"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Products
              </h2>

              <Link
                to="/products"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            {recent.length === 0 ? (
              <EmptyState
                title="No products available."
                description="Add your first product to start managing your catalogue."
                action={
                  <Link
                    to="/products/new"
                    className="btn-primary"
                  >
                    Add Product
                  </Link>
                }
              />
            ) : (
              <ProductList
                products={recent}
                onDelete={setPendingDelete}
              />
            )}
          </section>
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${pendingDelete?.name ?? "product"}?`}
        description="Are you sure you want to delete this product? This action cannot be undone."
        busy={saving}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default Dashboard;