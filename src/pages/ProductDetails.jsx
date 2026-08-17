import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import ConfirmDialog from "../components/ConfirmDialog";
import {
  BackLink,
  ErrorMessage,
  LoadingSpinner,
  StatusBadge,
  StockBadge,
} from "../components/ui-kit";

import { useFetch } from "../hooks/useFetch";
import { formatDate, formatKES } from "../lib/format";

import {
  deleteProduct,
  getProduct,
} from "../services/productService";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fetcher = useCallback(
    () => getProduct(id),
    [id]
  );

  const {
    data: product,
    loading,
    error,
    refetch,
  } = useFetch(fetcher, [id]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await deleteProduct(id);

      toast.success("Product deleted successfully.");

      navigate("/products");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not delete the product."
      );
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading product..." />;
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl">
        <ErrorMessage
          message={error ?? "Product not found."}
          onRetry={refetch}
        />

        <div className="mt-4 text-center">
          <BackLink to="/products">
            &larr; Back to Products
          </BackLink>
        </div>
      </div>
    );
  }

  const details = [
    ["Category", product.category],
    ["SKU", product.sku || "—"],
    ["Stock", `${product.stock} units`],
    ["Created", formatDate(product.createdAt)],
    ["Last updated", formatDate(product.updatedAt)],
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <BackLink to="/products">
        &larr; Back to Products
      </BackLink>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <img
          src={product.image}
          alt={product.name}
          className="surface-card h-72 w-full object-cover sm:h-96"
        />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StockBadge stock={product.stock} />
            <StatusBadge status={product.status} />
          </div>

          <h1 className="mt-3 text-3xl font-bold text-foreground">
            {product.name}
          </h1>

          <p className="mt-2 text-2xl font-semibold text-primary">
            {formatKES(product.price)}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {label}
                </dt>

                <dd className="text-sm font-medium text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              to={`/products/${product.id}/edit`}
              className="btn-primary"
            >
              Edit Product
            </Link>

            <button
              type="button"
              className="btn-danger"
              onClick={() => setConfirmOpen(true)}
            >
              Delete Product
            </button>

            <Link
              to="/products"
              className="btn-secondary"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete ${product.name}?`}
        description="Are you sure you want to delete this product? This action cannot be undone."
        busy={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default ProductDetail;