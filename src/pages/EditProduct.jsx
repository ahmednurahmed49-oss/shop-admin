import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import ProductForm, { toFormValues } from "../components/ProductForm";
import {
  BackLink,
  ErrorMessage,
  LoadingSpinner,
  PageHeader,
} from "../components/ui-kit";

import { useFetch } from "../hooks/useFetch";
import { getProduct, updateProduct } from "../services/productService";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fetcher = useCallback(() => getProduct(id), [id]);

  const {
    data: product,
    loading,
    error,
    refetch,
  } = useFetch(fetcher, [id]);

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values) => {
    setSaving(true);

    try {
      await updateProduct(id, values);

      toast.success("Product updated successfully.");

      navigate(`/products/${id}`);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not update the product."
      );
    } finally {
      setSaving(false);
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
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <BackLink to="/products">
        &larr; Back to Products
      </BackLink>

      <PageHeader
        title="Edit Product"
        description={`Update the details for ${product.name}.`}
      />

      <ProductForm
        initialValues={toFormValues(product)}
        submitLabel="Save Changes"
        busyLabel="Saving product..."
        saving={saving}
        onSubmit={handleSubmit}
        cancelTo="/products"
      />
    </div>
  );
}

export default EditProduct;